import {User} from '../typings';
import React, {useEffect, useState} from 'react';
import {UserProvider} from '../components/user';
import API from '../api';
import '../styles/antd.less';
import '../styles/globals.less';
import {NextSeo} from 'next-seo';
import Loading from '../components/loading';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

LogRocket.init('8aprw6/imgsbar');
setupLogRocketReact(LogRocket);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function App({Component, pageProps}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          setLoading(false);
        }, 500);

        setTimeout(() => {
          refreshToken();
        }, 780000);
      } catch (e) {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    if (!user) refreshToken();
  }, []);

  return (
    <>
      <NextSeo
        title="imgs.bar"
        description="A private image host"
        additionalMetaTags={[
          {
            property: 'theme-color',
            content: '#39e66a',
          },
        ]}
        openGraph={{
          title: 'imgs.bar host',
          description: 'very sexy imgs host private yesyes',
          images: [
            {
              url: 'https://media.discordapp.net/attachments/735205297395859502/845637311198003240/images-removebg-preview5.png',
            },
          ],
        }}
      />
      {/* eslint-disable-next-line node/no-unsupported-features/node-builtins */}
      {console.log(
        '\n%cWelcome to\n%cimgs.bar\n',
        'font-size: 15px; color: black; font-weight: bold',
        'font-size: 36px; color: black; font-weight: bold'
      )}
      {loading ? (
        <Loading />
      ) : (
        <UserProvider value={{user, setUser}}>
          <Component {...pageProps} />
        </UserProvider>
      )}
    </>
  );
}
