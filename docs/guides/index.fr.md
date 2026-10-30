---
sidebarTitle: "React"
icon: "badge-check"
title: "React"
description: "The library for web and native user interfaces"
layout: home
---

<ReactDevHome>
  <ReactDevBlockHero
    :content='["React","The library for web and native user interfaces","Learn React","API Reference"]'
    title="React"
    lead="The library for web and native user interfaces"
    primary-label="Learn React"
    primary-href="https://react.dev/learn"
    secondary-label="API Reference"
    secondary-href="https://react.dev/reference/react"
  />

  <ReactDevBlockComponents
    :content='["Create user interfaces from components","React lets you build user interfaces out of individual pieces called components. Create your own React components like"," ","Thumbnail",", ","LikeButton",", and"," ","Video",". Then combine them into entire screens, pages, and apps.","Video.js","My video","Video description","Whether you work on your own or with thousands of other developers, using React feels the same. It is designed to let you seamlessly combine components written by independent people, teams, and organizations."]'
    :markup-content='["Write components with code and markup","React components are JavaScript functions. Want to show some content conditionally? Use an ","if"," statement. Displaying a list? Try array ","map()",". Learning React is learning programming.","VideoList.js","3 Videos","First video","Video description","Second video","Video description","Third video","Video description","This markup syntax is called JSX. It is a JavaScript syntax extension popularized by React. Putting JSX markup close to related rendering logic makes React components easy to create, maintain, and delete."]'
    :code-lines='["function Video({ video }) {","  return (","    <div>","      <Thumbnail video={video} />","      <a href={video.url}>","        <h3>{video.title}</h3>","        <p>{video.description}</p>","      </a>","      <LikeButton video={video} />","    </div>","  );","}"]'
    :markup-code-lines='["function VideoList({ videos, emptyHeading }) {","  const count = videos.length;","  let heading = emptyHeading;","  if (count > 0) {","    const noun = count > 1 ? \u0027Videos\u0027 : \u0027Video\u0027;","    heading = count + \u0027 \u0027 + noun;","  }","  return (","    <section>","      <h2>{heading}</h2>","      {videos.map(video =>","        <Video key={video.id} video={video} />","      )}","    </section>","  );","}"]'
    title="Create user interfaces from components"
    markup-title="Write components with code and markup"
  />

  <ReactDevBlockInteractivity
    :content='["Add interactivity wherever you need it","React components receive data and return what should appear on the screen. You can pass them new data in response to an interaction, like when the user types into an input. React will then update the screen to match the new data.","SearchableVideoList.js","example.com","/","videos.html","React Videos","A brief history of React","Search","5 Videos","React: The Documentary","The origin story of React","Rethinking Best Practices","Pete Hunt (2013)","Introducing React Native","Tom Occhino (2015)","Introducing React Hooks","Sophie Alpert and Dan Abramov (2018)","Introducing Server Components","Dan Abramov and Lauren Tan (2020)","You don’t have to build your whole page in React. Add React to your existing HTML page, and render interactive React components anywhere on it.","Add React to your page"]'
    :code-lines='["import { useState } from \u0027react\u0027;","","function SearchableVideoList({ videos }) {","  const [searchText, setSearchText] = useState(\u0027\u0027);","  const foundVideos = filterVideos(videos, searchText);","  return (","    <>","      <SearchInput","        value={searchText}","        onChange={newText => setSearchText(newText)} />","      <VideoList","        videos={foundVideos}","        emptyHeading={`No matches for “${searchText}”`} />","    </>","  );","}"]'
    title="Add interactivity wherever you need it"
    lead="React components receive data and return what should appear on the screen. You can pass them new data in response to an interaction, like when the user types into an input. React will then update the screen to match the new data."
    cta-label="Add React to your page"
    cta-href="https://react.dev/learn/add-react-to-an-existing-project"
  />

  <ReactDevBlockFramework
    :content='["Go full-stack ","with a framework","React is a library. It lets you put components together, but it doesn’t prescribe how to do routing and data fetching. To build an entire app with React, we recommend a full-stack React framework like ","Next.js"," or"," ","React Router",".","confs/[slug].js","example.com","/","confs/react-conf-2021","React Conf 2021","React Conf 2019","Search","19 Videos","React Conf","React 18 Keynote","The React Team","React Conf","React 18 for App Developers","Shruti Kapoor","React Conf","Streaming Server Rendering with Suspense","Shaundai Person","React Conf","The First React Working Group","Aakansha Doshi","React Conf","React Developer Tooling","Brian Vaughn","React Conf","React without memo","Xuan Huang (黄玄)","React Conf","React Docs Keynote","Rachel Nabors","React Conf","Things I Learnt from the New React Docs","Debbie O\u0027Brien","React Conf","Learning in the Browser","Sarah Rainsberger","React Conf","The ROI of Designing with React","Linton Ye","React Conf","Interactive Playgrounds with React","Delba de Oliveira","React Conf","Re-introducing Relay","Robert Balicki","React Conf","React Native Desktop","Eric Rozell and Steven Moyes","React Conf","On-device Machine Learning for React Native","Roman Rädle","React Conf","React 18 for External Store Libraries","Daishi Kato","React Conf","Building Accessible Components with React 18","Diego Haz","React Conf","Accessible Japanese Form Components with React","Tafu Nakazaki","React Conf","UI Tools for Artists","Lyle Troxell","React Conf","Hydrogen + React 18","Helen Lin","React is also an architecture. Frameworks that implement it let you fetch data in asynchronous components that run on the server or even during the build. Read data from a file or a database, and pass it down to your interactive components.","Get started with a framework"]'
    :code-lines='["import { db } from \u0027./database.js\u0027;","import { Suspense } from \u0027react\u0027;","","async function ConferencePage({ slug }) {","  const conf = await db.Confs.find({ slug });","  return (","    <ConferenceLayout conf={conf}>","      <Suspense fallback={<TalksLoading />}>","        <Talks confId={conf.id} />","      </Suspense>","    </ConferenceLayout>","  );","}","","async function Talks({ confId }) {","  const talks = await db.Talks.findAll({ confId });","  const videos = talks.map(talk => talk.video);","  return <SearchableVideoList videos={videos} />;","}"]'
    title="Go full-stack with a framework"
    cta-label="Get started with a framework"
    cta-href="https://react.dev/learn/creating-a-react-app"
  />

  <ReactDevBlockPlatforms
    :content='["Use the best from every platform","People love web and native apps for different reasons. React lets you build both web apps and native apps using the same skills. It leans upon each platform’s unique strengths to let your interfaces feel just right on every platform.","example.com","Stay true to the web","People expect web app pages to load fast. On the server, React lets you start streaming HTML while you’re still fetching data, progressively filling in the remaining content before any JavaScript code loads. On the client, React can use standard web APIs to keep your UI responsive even in the middle of rendering.","1:19 PM","Go truly native","People expect native apps to look and feel like their platform."," ","React Native"," ","and"," ","Expo"," ","let you build apps in React for Android, iOS, and more. They look and feel native because their UIs"," ","are"," truly native. It’s not a web view—your React components render real Android and iOS views provided by the platform.","With React, you can be a web ","and"," a native developer. Your team can ship to many platforms without sacrificing the user experience. Your organization can bridge the platform silos, and form teams that own entire features end-to-end.","Build for native platforms"]'
    title="Use the best from every platform"
    lead="People love web and native apps for different reasons. React lets you build both web apps and native apps using the same skills. It leans upon each platform’s unique strengths to let your interfaces feel just right on every platform."
    cta-label="Build for native platforms"
    cta-href="https://reactnative.dev/"
  />

  <ReactDevBlockUpdates
    :content='["Upgrade when the future is ready","React approaches changes with care. Every React commit is tested on business-critical surfaces with over a billion users. Over 100,000 React components at Meta help validate every migration strategy.","The React team is always researching how to improve React. Some research takes years to pay off. React has a high bar for taking a research idea into production. Only proven approaches become a part of React.","Read more React news","Latest React News","React 19.3","September 9, 2026","The React Foundation: A New Home for React Hosted by the Linux Foundation","February 24, 2026","Additional Vulnerabilities in RSC","December 11, 2025","Vulnerability in React Server Components","December 3, 2025","Read more React news"]'
    title="Upgrade when the future is ready"
    lead="React approaches changes with care. Every React commit is tested on business-critical surfaces with over a billion users. Over 100,000 React components at Meta help validate every migration strategy."
    cta-label="Read more React news"
    cta-href="https://react.dev/blog"
  />

  <ReactDevBlockCommunity
    :image-alts='["People singing karaoke at React Conf","Sunil Pai speaking at React India","A hallway conversation between two people at React Conf","A hallway conversation at React India","Elizabet Oliveira speaking at React Conf","People taking a group selfie at React India","Nat Alison speaking at React Conf","Organizers greeting attendees at React India","People singing karaoke at React Conf","Sunil Pai speaking at React India","A hallway conversation between two people at React Conf","A hallway conversation at React India","Elizabet Oliveira speaking at React Conf","People taking a group selfie at React India","Nat Alison speaking at React Conf","Organizers greeting attendees at React India","logo by @sawaratsuki1004"]'
    :content='["Join a community ","of millions","You’re not alone. Two million developers from all over the world visit the React docs every month. React is something that people and teams can agree on.","This is why React is more than a library, an architecture, or even an ecosystem. React is a community. It’s a place where you can ask for help, find opportunities, and meet new friends. You will meet both developers and designers, beginners and experts, researchers and artists, teachers and students. Our backgrounds may be very different, but React lets us all create user interfaces together.","Welcome to the ","React community","Get Started"]'
    title="Join a community of millions"
    lead="You’re not alone. Two million developers from all over the world visit the React docs every month. React is something that people and teams can agree on."
    cta-label="Get Started"
    cta-href="https://react.dev/learn"
  />
</ReactDevHome>
