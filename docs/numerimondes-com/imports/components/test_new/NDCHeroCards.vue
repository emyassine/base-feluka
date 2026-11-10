<template>
  <div style="display: grid; place-items: center">
    <div style="width: 100%">
      <div style="display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))">
        <!-- Card: Resources -->
        <div
          style="
            border: 1px solid color-mix(in srgb, var(--vp-c-border) 76%, transparent);
            background: color-mix(in srgb, var(--vp-c-bg-soft) 86%, transparent);
            border-radius: 16px;
            padding: 16px 16px 14px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          "
        >
          <div style="display: grid; gap: 8px">
            <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0.3rem">
              <div style="min-width: 0; letter-spacing: -0.01em; color: var(--vp-c-text-1)">Resources</div>

              <div style="margin-left: auto; flex: 0 0 auto; display: inline-flex">
                <NDCButton
                  tag="a"
                  href="/resources"
                  variant="blackwhite"
                  size="sm"
                  pill
                  icon="ArrowRight"
                  iconPosition="right"
                >
                  Open
                </NDCButton>
              </div>
            </div>

            <div style="font-size: 13px; line-height: 1.45; color: var(--vp-c-text-2)">
              Vision, research directions, and what will be documented.
            </div>
          </div>
        </div>

        <!-- Card: Products -->
        <div
          style="
            border: 1px solid color-mix(in srgb, var(--vp-c-border) 76%, transparent);
            background: color-mix(in srgb, var(--vp-c-bg-soft) 86%, transparent);
            border-radius: 16px;
            padding: 16px 16px 14px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          "
        >
          <div style="display: grid; gap: 8px">
            <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0.3rem">
              <div style="min-width: 0; letter-spacing: -0.01em; color: var(--vp-c-text-1)">Products</div>

              <div style="margin-left: auto; flex: 0 0 auto; display: inline-flex">
                <NDCButton
                  tag="a"
                  href="/products"
                  variant="blackwhite"
                  size="sm"
                  pill
                  icon="ArrowRight"
                  iconPosition="right"
                >
                  Open
                </NDCButton>
              </div>
            </div>

            <div style="font-size: 13px; line-height: 1.45; color: var(--vp-c-text-2)">
              Engineering outputs, starting with WebKernelPHP.
            </div>
          </div>
        </div>

        <!-- Card: About -->
        <div
          style="
            border: 1px solid color-mix(in srgb, var(--vp-c-border) 76%, transparent);
            background: color-mix(in srgb, var(--vp-c-bg-soft) 86%, transparent);
            border-radius: 16px;
            padding: 16px 16px 14px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          "
        >
          <div style="display: grid; gap: 8px">
            <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0.3rem">
              <div style="min-width: 0; letter-spacing: -0.01em; color: var(--vp-c-text-1)">About</div>

              <div style="margin-left: auto; flex: 0 0 auto; display: inline-flex">
                <NDCButton
                  tag="a"
                  href="/about"
                  variant="blackwhite"
                  size="sm"
                  pill
                  icon="ArrowRight"
                  iconPosition="right"
                >
                  Open
                </NDCButton>
              </div>
            </div>

            <div style="font-size: 13px; line-height: 1.45; color: var(--vp-c-text-2)">
              What Numerimondes is, what it is not, and why it exists.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
