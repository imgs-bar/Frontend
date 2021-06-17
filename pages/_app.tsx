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
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';

Sentry.init({
  dsn: 'https://0ac6be2c34e54b97a05ee31408736f38@o684538.ingest.sentry.io/5780231',
  integrations: [new Integrations.BrowserTracing()],
});

//LogRocket.init('8aprw6/imgsbar', {
//  shouldCaptureIP: false,
//});
//setupLogRocketReact(LogRocket);

//LogRocket.getSessionURL(sessionURL => {
//  Sentry.configureScope(scope => {
//    scope.setExtra('sessionURL', sessionURL);
//  });
//});

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

        LogRocket.identify(data.user.uid, {
          name: data.user.username,
          email: data.user.email,

          admin: data.user.admin,
          images: data.user.images,
        });
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
        description="One of the best invite-only image hosts around! With 200+ domains, and an amazing community!"
        additionalMetaTags={[
          {
            property: 'theme-color',
            content: '#005b96',
          },
        ]}
        openGraph={{
          title: 'imgs.bar invite-only host.',
          description:
            'One of the best invite-only image hosts around! With 200+ domains, and an amazing community!',
        }}
      />
      {/* eslint-disable-next-line node/no-unsupported-features/node-builtins */}
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
