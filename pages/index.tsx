import React, {useEffect, useState} from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import API, {APIError, register as registerUser} from '../api';
import {Button, Modal, Form, Input, notification} from 'antd';
import {
  CheckOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {SiDiscord} from 'react-icons/si';
import {useRouter} from 'next/router';
import {useUser} from '../components/user';
import ReCAPTCHA from 'react-google-recaptcha';

const {useForm} = Form;

export default function Index() {
  const initialState = {
    showLogin: false,
    showRegister: false,
    username: '',
    password: '',
    email: '',
    invite: '',
  };

  const [
    {showLogin, username, password, email, invite, showRegister},
    setState,
  ] = useState(initialState);
  const router = useRouter();
  const [form] = useForm();
  const {user, setUser} = useUser();
  const [bruh, confirmBruh] = React.useState(false);
  const [bruhReg, confirmBruhReg] = React.useState(false);
  const loginRecaptchaRef = React.createRef<ReCAPTCHA>(),
    registerRecaptchaRef = React.createRef<ReCAPTCHA>();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, []);

  const closeLogin = () => {
    form.resetFields();

    setState(() => ({
      ...initialState,
      showLogin: false,
    }));
  };

  const closeRegister = () => {
    form.resetFields();

    setState(() => ({
      ...initialState,
      showRegister: false,
    }));
  };

  const setInput = (property: string, val: string) => {
    setState(state => ({
      ...state,
      [property]: val,
    }));
  };

  const filter = (value: any) => {
    return value.filter((v: any, i: any) => value.indexOf(v) === i);
  };

  const refreshToken = async () => {
    try {
      const api = new API();
      const data = await api.refreshToken();
      const {images, motd} = await api.getImages();
      const {invites} = await api.getInvites();
      const {domains} = await api.getDomains();
      const {urls} = await api.getShortenedUrls();

      data.user['domains'] = domains;
      data.user['images'] = images;
      data.user['motd'] = motd;
      data.user['createdInvites'] = invites;
      data.user['shortenedUrls'] = urls;
      data.user['accessToken'] = data.accessToken;
      data.user['api'] = api;

      setUser(data.user);

      setTimeout(() => {
        refreshToken();
      }, 780000);
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
  };

  const doLoginCaptcha = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loginRecaptchaRef.current.execute();
  };

  const doRegisterCaptcha = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    registerRecaptchaRef.current.execute();
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const login = async captchaCode => {
    if (!captchaCode) {
      return;
    }
    confirmBruh(true);
    try {
      await form.validateFields(['username', 'password']);

      const api = new API();
      const data = await api.login(username, password, captchaCode);
      const {images, motd} = await api.getImages();
      const {invites} = await api.getInvites();
      const {domains} = await api.getDomains();
      const {urls} = await api.getShortenedUrls();

      if (data.success) {
        delete data.success;

        data.user['domains'] = domains;
        data.user['images'] = images;
        data.user['createdInvites'] = invites;
        data.user['motd'] = motd;
        data.user['shortenedUrls'] = urls;
        data.user['api'] = api;

        setUser(data.user);

        setTimeout(() => {
          refreshToken();
        }, 780000);

        router.push('/dashboard');
      }
    } catch (err) {
      confirmBruh(false);
      loginRecaptchaRef.current?.reset();

      if (err instanceof APIError)
        return notification.error({
          message: 'Something went wrong',
          description: err.message,
        });
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const register = async captchaCode => {
    if (!captchaCode) {
      return;
    }

    confirmBruhReg(true);
    try {
      await form.validateFields();
      const data = await registerUser(
        username,
        password,
        email,
        invite,
        captchaCode
      );
      if (data.success)
        notification.success({
          message: 'Success',
          description: 'Registered successfully, please login.',
        });
      confirmBruhReg(false);
    } catch (err) {
      registerRecaptchaRef.current?.reset();
      confirmBruhReg(false);
      if (err instanceof APIError)
        return notification.error({
          message: 'Something went wrong',
          description: err.message,
        });
    }
  };

  if (user) return null;

  return (
    <>
      <Head>
        <title>imgs.bar - Home</title>
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <div style={{marginLeft: '8px'}}>
            <img
              className={styles.logo}
              src="https://cdn.discordapp.com/attachments/824790681129844736/846031528962162708/beeeeeer.png"
              alt=""
            />
          </div>
          <h1 style={{color: 'white'}}>imgs.bar</h1>
          <div style={{marginTop: '8px'}}>
            <Button
              size="large"
              icon={<LockOutlined />}
              style={{
                marginRight: '15px',
                borderRadius: '5px',
                height: '40px',
                borderColor: 'white',
              }}
              onClick={() => setState(state => ({...state, showLogin: true}))}
            >
              Login
            </Button>
            <Button
              size="large"
              icon={<UserAddOutlined />}
              style={{
                marginRight: '15px',
                borderRadius: '5px',
                height: '40px',
                borderColor: 'white',
              }}
              onClick={() =>
                setState(state => ({
                  ...state,
                  showRegister: true,
                }))
              }
            >
              Register
            </Button>
            <Modal
              centered
              style={{border: 0}}
              className="authModal"
              visible={showLogin}
              onCancel={closeLogin}
              title={null}
              footer={
                <Form form={form} name="login" style={{marginTop: '10px'}}>
                  <ReCAPTCHA
                    size="invisible"
                    sitekey={'6LfOSuQaAAAAADCare4jtQMneJ0chlY2QEbuIOug'}
                    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    ref={loginRecaptchaRef}
                    onChange={login}
                  />
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Provide a valid username',
                        min: 3,
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      onPressEnter={doLoginCaptcha}
                      placeholder="Username"
                      prefix={<UserOutlined />}
                      onChange={val => setInput('username', val.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message:
                          'Provide a valid password (up to 100 characters)',
                        min: 5,
                        max: 100,
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      onPressEnter={doLoginCaptcha}
                      placeholder="Password"
                      prefix={<LockOutlined />}
                      onChange={val => setInput('password', val.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      block
                      size="large"
                      onClick={doLoginCaptcha}
                      loading={bruh}
                    >
                      Login
                    </Button>

                    <Button
                      href={`${process.env.BACKEND_URL}/auth/discord/login`}
                      icon={
                        <SiDiscord
                          style={{
                            marginRight: '8px',
                            marginTop: '8px',
                            marginBottom: '-4px',
                          }}
                        />
                      }
                      type="primary"
                      block
                      size="large"
                      style={{
                        marginTop: '10px',
                        marginBottom: '-35px',
                        backgroundColor: '#5865F2',
                        border: 'none',
                        marginLeft: '-20px',
                      }}
                    >
                      Authenticate via Discord
                    </Button>
                  </Form.Item>
                </Form>
              }
            />
            <Modal
              centered
              style={{border: 0}}
              className="authModal"
              visible={showRegister}
              onCancel={closeRegister}
              title={null}
              footer={
                <Form form={form} name="register" style={{marginTop: '10px'}}>
                  <ReCAPTCHA
                    size="invisible"
                    sitekey={'6LfOSuQaAAAAADCare4jtQMneJ0chlY2QEbuIOug'}
                    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    ref={registerRecaptchaRef}
                    onChange={register}
                  />
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Provide a valid username',
                        min: 3,
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Username"
                      onPressEnter={doRegisterCaptcha}
                      prefix={<UserOutlined />}
                      onChange={val => setInput('username', val.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message:
                          'Provide a valid password (up to 100 characters)',
                        min: 5,
                        max: 100,
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Password"
                      onPressEnter={doRegisterCaptcha}
                      prefix={<LockOutlined />}
                      onChange={val => setInput('password', val.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Provide a valid email',
                        type: 'email',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Email"
                      onPressEnter={doRegisterCaptcha}
                      prefix={<MailOutlined />}
                      onChange={val => setInput('email', val.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="invite"
                    rules={[
                      {required: true, message: 'Provide a valid invite'},
                    ]}
                    initialValue={invite ? invite : ''}
                  >
                    <Input
                      size="large"
                      placeholder="Invite"
                      onPressEnter={doRegisterCaptcha}
                      prefix={<CheckOutlined />}
                      onChange={val => setInput('invite', val.target.value)}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      block
                      size="large"
                      onClick={doRegisterCaptcha}
                      style={{marginBottom: '-30px'}}
                      loading={bruhReg}
                    >
                      Register
                    </Button>
                  </Form.Item>
                </Form>
              }
            />
          </div>
        </main>
      </div>
    </>
  );
}
