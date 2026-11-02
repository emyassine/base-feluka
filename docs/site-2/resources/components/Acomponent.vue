
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
      <h2>Possibility becomes valuable through execution.</h2>

      <div class="yc-quotes">
        <p>
          <span>Every organization has opportunities waiting to be explored:</span>
          <span>processes that could run better</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="Collaborative team working through a business process"
              loading="lazy"
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <span class="yc-illustration-preview">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=680&h=460&q=85"
              />
              <span>Processes that work better</span>
            </span>
          </span>,
          <span>information that could support faster decisions</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="Business data and charts used to support decisions"
              loading="lazy"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <span class="yc-illustration-preview">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=680&h=460&q=85"
              />
              <span>Information for faster decisions</span>
            </span>
          </span>,
          <span>new services worth developing</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="Team discussing ideas for a new service"
              loading="lazy"
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <span class="yc-illustration-preview">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=680&h=460&q=85"
              />
              <span>Ideas for new services</span>
            </span>
          </span>, and
          <span>ways to connect people, systems and markets.</span>
        </p>

        <p>
          <span>We combine research, commercial thinking and engineering</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="People sharing research and ideas around a table"
              loading="lazy"
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <span class="yc-illustration-preview">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=680&h=460&q=85"
              />
              <span>Research, thinking and engineering</span>
            </span>
          </span>
          <span>to examine these possibilities, shape viable approaches and move selected projects into action.</span>
        </p>

        <p>
          <span>Our contribution can begin with an idea, a question, an operational challenge or a clear project brief.</span>
          <span class="yc-illustration" tabindex="0">
            <img
              alt="Colleagues working together on a project brief"
              loading="lazy"
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <span class="yc-illustration-preview">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=680&h=460&q=85"
              />
              <span>From a brief to a project in action</span>
            </span>
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.yc-about {
  color: var(--vp-c-text-1);
  padding: 28px 0 100px;
  font-size: 15px;
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
  font-size: 9px;
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
  text-decoration-color: #cbbfae;
  text-underline-offset: 3px;
}

/* Inline illustrations */

.yc-illustration {
  display: inline-block;
  position: relative;
  width: 23px;
  height: 23px;
  margin: 0 3px;
  vertical-align: middle;
  cursor: pointer;
  outline-offset: 3px;
  white-space: nowrap;
}

.yc-illustration > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #d2ccc1;
  transition: transform 180ms ease;
}

.yc-illustration:hover > img,
.yc-illustration:focus-visible > img {
  transform: scale(1.14);
}

/* Large illustration preview on hover */

.yc-illustration-preview {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  width: 210px;
  padding: 5px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.17);
  z-index: 20;

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(-50%, -6px) scale(0.96);
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    visibility 180ms ease;
}

.yc-illustration-preview img {
  display: block;
  width: 100%;
  aspect-ratio: 1.48 / 1;
  object-fit: cover;
  border-radius: 5px;
}

.yc-illustration-preview > span {
  display: block;
  padding: 8px 4px 4px;
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
