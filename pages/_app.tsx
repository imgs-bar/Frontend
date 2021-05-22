import {User} from '../typings';
import React, {useEffect, useState} from 'react';
import {UserProvider} from '../components/user';
import API from '../api';
import '../styles/antd.less';
import '../styles/globals.less';
import {NextSeo} from 'next-seo';
import Router from 'next/router';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import NProgress from 'nprogress';
import Bugsnag from '@bugsnag/js';

import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
  apiKey: '6fc94a87a493f3f0b9f51cb084defc34',
  plugins: [new BugsnagPluginReact()],
  collectUserIp: false,
});

LogRocket.init('8aprw6/imgsbar');
setupLogRocketReact(LogRocket);

NProgress.configure({showSpinner: true});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function App({Component, pageProps}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const refreshToken = async () => {
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
    };

    if (!user) refreshToken();
  }, []);

  return (
    <ErrorBoundary>
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
                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU1S7Oy7WX6At6X6YrsK--udw5CKZlTUtKqw&usqp=CAU',
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
        <UserProvider value={{user, setUser}}>
          <Component {...pageProps} />
        </UserProvider>
      </>
    </ErrorBoundary>
  );
}
