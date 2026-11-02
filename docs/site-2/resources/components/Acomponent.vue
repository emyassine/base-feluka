
<template>
  <section class="yc-about">
    <div class="yc-introduction">
    <h1>
     Numerimondes is an independent consulting and solutions company.
     <br>
     <br>
    </h1>
     <p class="yc-dropcap">
     We explore opportunities, develop ideas, design practical solutions and bring together the expertise needed to make projects happen.
     </p>
     <br>
    </div>

    <div class="yc-gallery">
      <img
        alt="Founder"
        loading="lazy"
        src="https://bookface-static.ycombinator.com/assets/ycdc/about/strip-picture-2-compressed-a5f4c41c8c039e0bb0b38bb9d316b79ea9f8211d9e4fa19cf80a1377e74b3036.jpg"
      />
      <img
        alt="Founders in San Francisco"
        loading="lazy"
        src="https://bookface-static.ycombinator.com/assets/ycdc/about/strip-picture-4-compressed-077596611ae3be172d6407ab7a9423f205939fbcfeef24fd54ca8da4f1370b27.jpg"
      />
      <img
        alt="Founders gathering"
        loading="lazy"
        src="https://bookface-static.ycombinator.com/assets/ycdc/about/strip-picture-6-compressed-cd04f86654c60d7c2642aeb14a7c7cd42719036be4e7764fd58a386383671fb6.jpg"
      />
      <img
        alt="Founder presentation"
        loading="lazy"
        src="https://bookface-static.ycombinator.com/assets/ycdc/about/strip-picture-1-compressed-569ab168698179832828d33e2cec6a76f2180fe19425d688788badc68a676d34.jpg"
      />
      <img
        alt="Founders speaking"
        loading="lazy"
        src="https://bookface-static.ycombinator.com/assets/ycdc/about/strip-picture-7-compressed-7f5971e8a87c7c6925fb2f68db87e098033291969eba2a5cabb46398978193e5.jpg"
      />
    </div>

    <div class="yc-testimonials">
      <h2>Possibility<br>becomes valuable<br>through execution.</h2>

      <div class="yc-quotes">
        <p>
          <span>Every organization has opportunities waiting to be explored:</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="A team collaborating around a table"
              loading="lazy"
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=96&h=72&q=80"
            />
            <span class="yc-illustration-preview">
              <img alt="" loading="lazy" src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=640&h=420&q=85" />
              <span>People working through opportunities together</span>
            </span>
          </span>
          <span>processes that could run better, information that could support faster decisions, new services worth developing, and ways to connect people, systems and markets.</span>
        </p>

        <p>
          <span>We combine research, commercial thinking and engineering</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="A workspace set up for focused research and planning"
              loading="lazy"
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=96&h=72&q=80"
            />
            <span class="yc-illustration-preview">
              <img alt="" loading="lazy" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=640&h=420&q=85" />
              <span>Research and planning workspace</span>
            </span>
          </span>
          <span>to examine these possibilities, shape viable approaches and move selected projects into action.</span>
        </p>

        <p>
          <span>Our contribution can begin with an idea, a question, an operational challenge</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="Colleagues discussing a project together"
              loading="lazy"
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=96&h=72&q=80"
            />
            <span class="yc-illustration-preview">
              <img alt="" loading="lazy" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=640&h=420&q=85" />
              <span>Project discussion and planning</span>
            </span>
          </span>
          <span>or a clear project brief.</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.yc-about {
  color: var(--vp-c-text-1);
  padding: 28px 0 100px;
  line-height: 1.52;
}

/* Narrow editorial text */

.yc-introduction,
.yc-testimonials {
  width: min(100% - 40px, 544px);
  margin-inline: auto;
}

.yc-introduction p {
  margin: 0 0 20px;
}


/* Full-width photo strip */

.yc-gallery {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  margin: 46px 0 44px;
}

.yc-gallery > img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 5px;
  min-width: 0;
}

/* Testimonials */

.yc-testimonials h2 {
  margin: 0 0 16px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.yc-quotes p {
  margin: 0 0 20px;
  line-height: 1.55;
}

.yc-quotes p > span:not(.yc-illustration) {
  text-decoration: underline;
  text-decoration-color: var(--vp-c-brand-1, #cbbfae);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

/* Inline images */

.yc-illustration {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 22px;
  margin-inline: 8px;
  vertical-align: middle;
  cursor: pointer;
  outline-offset: 3px;
}

.yc-illustration > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #d2ccc1;
  border-radius: 4px;
  transition: transform 160ms ease;
}

.yc-illustration:hover > img,
.yc-illustration:focus-visible > img { transform: scale(1.08); }

.yc-illustration-preview {
  position: absolute;
  z-index: 20;
  top: calc(100% + 10px);
  left: 50%;
  width: 190px;
  padding: 5px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 36px rgb(0 0 0 / 0.18);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, -5px) scale(0.97);
  transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
}

.yc-illustration-preview img {
  display: block;
  width: 100%;
  aspect-ratio: 1.5 / 1;
  object-fit: cover;
  border-radius: 5px;
}

.yc-illustration-preview > span {
  display: block;
  padding: 7px 4px 3px;
  color: #292929;
  font-size: 11px;
  line-height: 1.3;
  text-align: center;
}

.yc-illustration:hover .yc-illustration-preview,
.yc-illustration:focus-visible .yc-illustration-preview {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0) scale(1);
}

/* Responsive */

@media (max-width: 700px) {
  .yc-about {
    padding-top: 28px;
  }

  .yc-gallery {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 0 12px 8px;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
  }

  .yc-gallery::-webkit-scrollbar {
    display: none;
  }

  .yc-gallery > img {
    flex: 0 0 72%;
    width: 72%;
    aspect-ratio: 1 / 1;
    scroll-snap-align: center;
  }
}
</style>
