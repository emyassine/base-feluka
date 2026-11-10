title: string
titleTemplate: string | boolean
description: string
head:
  - - meta
    - name: string
      content: string
layout: doc | home | page
navbar: boolean
sidebar: boolean
aside: boolean | 'left'
outline: number | [number, number] | 'deep' | false
lastUpdated: boolean | Date
editLink: boolean
footer: boolean
pageClass: string
isHome: boolean
hero:
  name: string
  text: string
  tagline: string
  image:
    src: string
    alt: string
  actions:
    - theme: brand | alt
      text: string
      link: string
features:
  - icon: string
    title: string
    details: string
    link: string
    linkText: string
    rel: string
    target: string
