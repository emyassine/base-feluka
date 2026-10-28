use crate::feluqa_ui_classnames::*;
use crate::runtime::prelude::*;
use crate::strum::Display;

#[derive(FeluqaClass, Clone, Copy)]
#[feluqa(class = "flex justify-center items-center w-full")]
pub struct Animate {
    pub variant: AnimateVariant,
    pub hover_variant: AnimateHoverVariant,
}

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

#[component]
pub fn Animate(
    #[prop(into, optional)] variant: Signal<AnimateVariant>,
    #[prop(into, optional)] hover_variant: Signal<AnimateHoverVariant>,
    #[prop(into, optional)] class: String,
    #[prop(into, optional)] style: Signal<String>,

    children: Children,
) -> impl IntoView {
    let merged_class = move || {
        let animate = Animate {
            variant: variant.get(),
            hover_variant: hover_variant.get(),
        };
        animate.with_class(class.clone())
    };

    view! {
        <div class=merged_class style=style>
            {children()}
        </div>
    }
}

#[component]
pub fn AnimateGroup(#[prop(into, optional)] class: String, children: Children) -> impl IntoView {
    let merged_class = class_merge!("w-full", class);

    view! { <div class=merged_class>{children()}</div> }
}

#[component]
pub fn AnimateGroupItem(
    #[prop(into, optional)] variant: Signal<AnimateVariant>,
    #[prop(into, optional)] hover_variant: Signal<AnimateHoverVariant>,
    #[prop(into, optional)] class: String,
    #[prop(into)] delay_ms: Signal<u32>,
    #[prop(default = "forwards")] fill_mode: &'static str,

    children: Children,
) -> impl IntoView {
    let merged_class = move || {
        let animate = Animate {
            variant: variant.get(),
            hover_variant: hover_variant.get(),
        };
        animate.with_class(class.clone())
    };

    let style = move || {
        let delay = delay_ms.get();
        crate::std::format!("animation-delay: {delay}ms; animation-fill-mode: {fill_mode};")
    };

    view! {
        <div class=merged_class style=style>
            {children()}
        </div>
    }
}

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

/// TODO later.

#[derive(FeluqaVariant)]
pub enum AnimateVariant {
    #[feluqa(default, class = "")]
    Default,
    #[feluqa(class = "opacity-0 animate-fade_up")]
    FadeUp,
    #[feluqa(
        class = "animate-fade_out_down   [animation-range:0px_300px] [animation-timeline:scroll()] supports-no-scroll-driven-animations:animate-none"
    )]
    AnimateScrollFadeOut,
    #[feluqa(
        class = "animate-make_it_bigger   [animation-range:0%_60%] [animation-timeline:--quote] [view-timeline-name:--quote] supports-no-scroll-driven-animations:animate-none"
    )]
    AnimateScrollBigger,
}

#[derive(FeluqaVariant, Display)]
pub enum AnimateHoverVariant {
    #[feluqa(default, class = "")]
    Default,
    #[feluqa(class = "hover:animate-Blink")]
    Blink,
    #[feluqa(class = "hover:animate-BlurredFadeIn")]
    BlurredFadeIn,
    #[feluqa(class = "hover:animate-BounceFadeIn")]
    BounceFadeIn,
    #[feluqa(class = "hover:animate-BounceHorizontal")]
    BounceHorizontal,
    #[feluqa(class = "hover:animate-BounceVertical")]
    BounceVertical,
    #[feluqa(class = "hover:animate-BounceCustom")] // TODO: check
    BounceCustom,
    #[feluqa(class = "hover:animate-ContractHorizontally")]
    ContractHorizontally,
    #[feluqa(class = "hover:animate-ContractVertically")]
    ContractVertically,
    #[feluqa(class = "hover:animate-ExpandHorizontally")]
    ExpandHorizontally,
    #[feluqa(class = "hover:animate-ExpandVertically")]
    ExpandVertically,
    #[feluqa(class = "hover:animate-FadeIn")]
    FadeIn,
    #[feluqa(class = "hover:animate-FadeInDown")]
    FadeInDown,
    #[feluqa(class = "hover:animate-FadeInLeft")]
    FadeInLeft,
    #[feluqa(class = "hover:animate-FadeInRight")]
    FadeInRight,
    #[feluqa(class = "hover:animate-FadeInUp")]
    FadeInUp,
    #[feluqa(class = "hover:animate-FadeOut")]
    FadeOut,
    #[feluqa(class = "hover:animate-FadeOutUp")]
    FadeOutUp,
    #[feluqa(class = "hover:animate-FadeOutDownV2")] // TODO: V2
    FadeOutDownV2,
    #[feluqa(class = "hover:animate-FadeOutLeft")]
    FadeOutLeft,
    #[feluqa(class = "hover:animate-FadeOutRight")]
    FadeOutRight,
    #[feluqa(class = "hover:animate-Flash")]
    Flash,
    #[feluqa(class = "hover:animate-FlashV0")] // TODO
    FlashV0,
    #[feluqa(class = "hover:animate-FlipHorizontal")]
    FlipHorizontal,
    #[feluqa(class = "hover:animate-FlipVertical")]
    FlipVertical,
    #[feluqa(class = "hover:animate-FlipX")]
    FlipX,
    #[feluqa(class = "hover:animate-FlipY")]
    FlipY,
    #[feluqa(class = "hover:animate-FlipInY")]
    FlipInY,
    #[feluqa(class = "hover:animate-FlipInX")]
    FlipInX,
    #[feluqa(class = "hover:animate-FlipOutY")]
    FlipOutY,
    #[feluqa(class = "hover:animate-FlipOutX")]
    FlipOutX,
    #[feluqa(class = "hover:animate-Float")]
    Float,
    #[feluqa(class = "hover:animate-Hang")]
    Hang,
    #[feluqa(class = "hover:animate-Heartbeat")]
    Heartbeat,
    #[feluqa(class = "hover:animate-HorizontalVibration")]
    HorizontalVibration,
    #[feluqa(class = "hover:animate-Jiggle")]
    Jiggle,
    #[feluqa(class = "hover:animate-JiggleV0")] // TODO
    JiggleV0,
    #[feluqa(class = "hover:animate-Jump")]
    Jump,
    #[feluqa(class = "hover:animate-Pop")]
    Pop,
    #[feluqa(class = "hover:animate-PulseCustom")] // TODO: custom
    PulseCustom,
    #[feluqa(class = "hover:animate-PulseFadeIn")]
    PulseFadeIn,
    #[feluqa(class = "hover:animate-Rise")]
    Rise,
    #[feluqa(class = "hover:animate-RollIn")]
    RollIn,
    #[feluqa(class = "hover:animate-RollOut")]
    RollOut,
    #[feluqa(class = "hover:animate-Rotate180")]
    Rotate180,
    #[feluqa(class = "hover:animate-Rotate360")]
    Rotate360,
    #[feluqa(class = "hover:animate-Rotate90")]
    Rotate90,
    #[feluqa(class = "hover:animate-RotateIn")]
    RotateIn,
    #[feluqa(class = "hover:animate-RotateOut")]
    RotateOut,
    #[feluqa(class = "hover:animate-RotationalWave")]
    RotationalWave,
    #[feluqa(class = "hover:animate-RubberBand")]
    RubberBand,
    #[feluqa(class = "hover:animate-RubberBandV0")] // TODO
    RubberBandV0,
    #[feluqa(class = "hover:animate-Scale")] // TODO
    Scale,
    #[feluqa(class = "hover:animate-Shake")]
    Shake,
    #[feluqa(class = "hover:animate-ShakeV0")] // TODO
    ShakeV0,
    #[feluqa(class = "hover:animate-Sink")]
    Sink,
    #[feluqa(class = "hover:animate-Skew")]
    Skew,
    #[feluqa(class = "hover:animate-SlideDown")]
    SlideDown,
    #[feluqa(class = "hover:animate-SlideDownAndFade")]
    SlideDownAndFade,
    #[feluqa(class = "hover:animate-SlideInBottom")]
    SlideInBottom,
    #[feluqa(class = "hover:animate-SlideInLeft")]
    SlideInLeft,
    #[feluqa(class = "hover:animate-SlideInRight")]
    SlideInRight,
    #[feluqa(class = "hover:animate-SlideInTop")]
    SlideInTop,
    #[feluqa(class = "hover:animate-SlideLeft")]
    SlideLeft,
    #[feluqa(class = "hover:animate-SlideLeftAndFade")]
    SlideLeftAndFade,
    #[feluqa(class = "hover:animate-SlideOutBottom")]
    SlideOutBottom,
    #[feluqa(class = "hover:animate-SlideOutLeft")]
    SlideOutLeft,
    #[feluqa(class = "hover:animate-SlideOutTop")]
    SlideOutTop,
    #[feluqa(class = "hover:animate-SlideRight")]
    SlideRight,
    #[feluqa(class = "hover:animate-SlideRightAndFade")]
    SlideRightAndFade,
    #[feluqa(class = "hover:animate-SlideRotateIn")]
    SlideRotateIn,
    #[feluqa(class = "hover:animate-SlideRotateOut")]
    SlideRotateOut,
    #[feluqa(class = "hover:animate-SlideUp")]
    SlideUp,
    #[feluqa(class = "hover:animate-SlideUpAndFade")]
    SlideUpAndFade,
    #[feluqa(class = "hover:animate-SlideUpFade")]
    SlideUpFade,
    #[feluqa(class = "hover:animate-SpinClockwise")]
    SpinClockwise,
    #[feluqa(class = "hover:animate-SpinCounterClockwise")]
    SpinCounterClockwise,
    #[feluqa(class = "hover:animate-Sway")]
    Sway,
    #[feluqa(class = "hover:animate-Swing")]
    Swing,
    #[feluqa(class = "hover:animate-SwingDropIn")]
    SwingDropIn,
    #[feluqa(class = "hover:animate-SwingV0")] // TODO
    SwingV0,
    #[feluqa(class = "hover:animate-Squeeze")]
    Squeeze,
    #[feluqa(class = "hover:animate-Tada")]
    Tada,
    #[feluqa(class = "hover:animate-TiltHorizontal")]
    TiltHorizontal,
    #[feluqa(class = "hover:animate-Vibrate")]
    Vibrate,
    #[feluqa(class = "hover:animate-Wobble")]
    Wobble,
    #[feluqa(class = "hover:animate-ZoomIn")]
    ZoomIn,
    #[feluqa(class = "hover:animate-ZoomOut")]
    ZoomOut,
}
