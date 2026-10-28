use crate::icons::common::icon_type::{IconType, IconTypeAnimated};
use crate::icons::common::static_svg_element::StaticSvgElement;

/*
 * This file was was generated automatically. Please DO NOT edit manually.

 * It contains:
 * - get_icon_css
 * - get_icon_elements
 * - get_animated_icon_elements
*/

/// Get CSS for a specific animated icon. Zero-allocation O(1) lookup.CSS.
pub fn get_icon_css(icon_type: IconTypeAnimated) -> Option<&'static str> {
    match icon_type {
        IconTypeAnimated::AArrowDownAnimate => Some(super::icon_registry_css::AARROWDOWN_CSS),
        IconTypeAnimated::AirVentAnimate => Some(super::icon_registry_css::AIRVENT_CSS),
        IconTypeAnimated::AlarmClockAnimate => Some(super::icon_registry_css::ALARMCLOCK_CSS),
        IconTypeAnimated::AlignCenterAnimate => Some(super::icon_registry_css::ALIGNCENTER_CSS),
        IconTypeAnimated::AngryAnimate => Some(super::icon_registry_css::ANGRY_CSS),
        IconTypeAnimated::AnnoyedAnimate => Some(super::icon_registry_css::ANNOYED_CSS),
        IconTypeAnimated::ArchiveAnimate => Some(super::icon_registry_css::ARCHIVE_CSS),
        IconTypeAnimated::ArrowBigDownAnimate => Some(super::icon_registry_css::ARROWBIGDOWN_CSS),
        IconTypeAnimated::ArrowBigDownDashAnimate => {
            Some(super::icon_registry_css::ARROWBIGDOWNDASH_CSS)
        }
        IconTypeAnimated::ArrowBigLeftAnimate => Some(super::icon_registry_css::ARROWBIGLEFT_CSS),
        IconTypeAnimated::ArrowBigLeftDashAnimate => {
            Some(super::icon_registry_css::ARROWBIGLEFTDASH_CSS)
        }
        IconTypeAnimated::BlocksAnimate => Some(super::icon_registry_css::BLOCKS_CSS),
        IconTypeAnimated::CalendarDaysAnimate => Some(super::icon_registry_css::CALENDARDAYS_CSS),
        IconTypeAnimated::CompassAnimate => Some(super::icon_registry_css::COMPASS_CSS),
        IconTypeAnimated::ExpandAnimate => Some(super::icon_registry_css::EXPAND_CSS),
        IconTypeAnimated::FrameAnimate => Some(super::icon_registry_css::FRAME_CSS),
        IconTypeAnimated::HeartAnimate => Some(super::icon_registry_css::HEART_CSS),
        IconTypeAnimated::PanelLeftOpenAnimate => Some(super::icon_registry_css::PANELLEFTOPEN_CSS),
        IconTypeAnimated::PlusAnimate => Some(super::icon_registry_css::PLUS_CSS),
        IconTypeAnimated::SearchAnimate => Some(super::icon_registry_css::SEARCH_CSS),
        IconTypeAnimated::SquareChevronRightAnimate => {
            Some(super::icon_registry_css::SQUARECHEVRONRIGHT_CSS)
        }
        IconTypeAnimated::TornadoAnimate => Some(super::icon_registry_css::TORNADO_CSS),
        IconTypeAnimated::WindAnimate => Some(super::icon_registry_css::WIND_CSS),
    }
}

/// Get static SVG elements for a specific animated icon. Zero-allocation O(1) lookup.
pub fn get_animated_icon_elements(
    icon_type: IconTypeAnimated,
) -> Option<&'static [StaticSvgElement]> {
    match icon_type {
        IconTypeAnimated::AArrowDownAnimate => {
            Some(crate::icons::common::icon_registry_elements::AARROWDOWN_ELEMENTS)
        }
        IconTypeAnimated::AirVentAnimate => {
            Some(crate::icons::common::icon_registry_elements::AIRVENT_ELEMENTS)
        }
        IconTypeAnimated::AlarmClockAnimate => {
            Some(crate::icons::common::icon_registry_elements::ALARMCLOCK_ELEMENTS)
        }
        IconTypeAnimated::AlignCenterAnimate => {
            Some(crate::icons::common::icon_registry_elements::ALIGNCENTER_ELEMENTS)
        }
        IconTypeAnimated::AngryAnimate => {
            Some(crate::icons::common::icon_registry_elements::ANGRY_ELEMENTS)
        }
        IconTypeAnimated::AnnoyedAnimate => {
            Some(crate::icons::common::icon_registry_elements::ANNOYED_ELEMENTS)
        }
        IconTypeAnimated::ArchiveAnimate => {
            Some(crate::icons::common::icon_registry_elements::ARCHIVE_ELEMENTS)
        }
        IconTypeAnimated::ArrowBigDownAnimate => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGDOWN_ELEMENTS)
        }
        IconTypeAnimated::ArrowBigDownDashAnimate => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGDOWNDASH_ELEMENTS)
        }
        IconTypeAnimated::ArrowBigLeftAnimate => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGLEFT_ELEMENTS)
        }
        IconTypeAnimated::ArrowBigLeftDashAnimate => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGLEFTDASH_ELEMENTS)
        }
        IconTypeAnimated::BlocksAnimate => {
            Some(crate::icons::common::icon_registry_elements::BLOCKS_ELEMENTS)
        }
        IconTypeAnimated::CalendarDaysAnimate => {
            Some(crate::icons::common::icon_registry_elements::CALENDARDAYS_ELEMENTS)
        }
        IconTypeAnimated::CompassAnimate => {
            Some(crate::icons::common::icon_registry_elements::COMPASS_ELEMENTS)
        }
        IconTypeAnimated::ExpandAnimate => {
            Some(crate::icons::common::icon_registry_elements::EXPAND_ELEMENTS)
        }
        IconTypeAnimated::FrameAnimate => {
            Some(crate::icons::common::icon_registry_elements::FRAME_ELEMENTS)
        }
        IconTypeAnimated::HeartAnimate => {
            Some(crate::icons::common::icon_registry_elements::HEART_ELEMENTS)
        }
        IconTypeAnimated::PanelLeftOpenAnimate => {
            Some(crate::icons::common::icon_registry_elements::PANELLEFTOPEN_ELEMENTS)
        }
        IconTypeAnimated::PlusAnimate => {
            Some(crate::icons::common::icon_registry_elements::PLUS_ELEMENTS)
        }
        IconTypeAnimated::SearchAnimate => {
            Some(crate::icons::common::icon_registry_elements::SEARCH_ELEMENTS)
        }
        IconTypeAnimated::SquareChevronRightAnimate => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHEVRONRIGHT_ELEMENTS)
        }
        IconTypeAnimated::TornadoAnimate => {
            Some(crate::icons::common::icon_registry_elements::TORNADO_ELEMENTS)
        }
        IconTypeAnimated::WindAnimate => {
            Some(crate::icons::common::icon_registry_elements::WIND_ELEMENTS)
        }
    }
}

/* ========================================================== */
/*                     ✨ FUNCTIONS ✨                        */
/* ========================================================== */

/// Registry mapping IconType to static SVG elements
pub fn get_icon_elements(icon: IconType) -> Option<&'static [StaticSvgElement]> {
    match icon {
        IconType::AArrowDown => {
            Some(crate::icons::common::icon_registry_elements::AARROWDOWN_ELEMENTS)
        }
        IconType::AArrowUp => Some(crate::icons::common::icon_registry_elements::AARROWUP_ELEMENTS),
        IconType::ALargeSmall => {
            Some(crate::icons::common::icon_registry_elements::ALARGESMALL_ELEMENTS)
        }
        IconType::Accessibility => {
            Some(crate::icons::common::icon_registry_elements::ACCESSIBILITY_ELEMENTS)
        }
        IconType::Activity => Some(crate::icons::common::icon_registry_elements::ACTIVITY_ELEMENTS),
        IconType::AirVent => Some(crate::icons::common::icon_registry_elements::AIRVENT_ELEMENTS),
        IconType::Airplay => Some(crate::icons::common::icon_registry_elements::AIRPLAY_ELEMENTS),
        IconType::AlarmClock => {
            Some(crate::icons::common::icon_registry_elements::ALARMCLOCK_ELEMENTS)
        }
        IconType::AlarmClockCheck => {
            Some(crate::icons::common::icon_registry_elements::ALARMCLOCKCHECK_ELEMENTS)
        }
        IconType::AlarmClockMinus => {
            Some(crate::icons::common::icon_registry_elements::ALARMCLOCKMINUS_ELEMENTS)
        }
        IconType::AlarmClockOff => {
            Some(crate::icons::common::icon_registry_elements::ALARMCLOCKOFF_ELEMENTS)
        }
        IconType::AlarmClockPlus => {
            Some(crate::icons::common::icon_registry_elements::ALARMCLOCKPLUS_ELEMENTS)
        }
        IconType::AlarmSmoke => {
            Some(crate::icons::common::icon_registry_elements::ALARMSMOKE_ELEMENTS)
        }
        IconType::Album => Some(crate::icons::common::icon_registry_elements::ALBUM_ELEMENTS),
        IconType::AlignCenter => {
            Some(crate::icons::common::icon_registry_elements::ALIGNCENTER_ELEMENTS)
        }
        IconType::AlignCenterHorizontal => {
            Some(crate::icons::common::icon_registry_elements::ALIGNCENTERHORIZONTAL_ELEMENTS)
        }
        IconType::AlignCenterVertical => {
            Some(crate::icons::common::icon_registry_elements::ALIGNCENTERVERTICAL_ELEMENTS)
        }
        IconType::AlignEndHorizontal => {
            Some(crate::icons::common::icon_registry_elements::ALIGNENDHORIZONTAL_ELEMENTS)
        }
        IconType::AlignEndVertical => {
            Some(crate::icons::common::icon_registry_elements::ALIGNENDVERTICAL_ELEMENTS)
        }
        IconType::AlignHorizontalDistributeCenter => Some(
            crate::icons::common::icon_registry_elements::ALIGNHORIZONTALDISTRIBUTECENTER_ELEMENTS,
        ),
        IconType::AlignHorizontalDistributeEnd => Some(
            crate::icons::common::icon_registry_elements::ALIGNHORIZONTALDISTRIBUTEEND_ELEMENTS,
        ),
        IconType::AlignHorizontalDistributeStart => Some(
            crate::icons::common::icon_registry_elements::ALIGNHORIZONTALDISTRIBUTESTART_ELEMENTS,
        ),
        IconType::AlignHorizontalJustifyCenter => Some(
            crate::icons::common::icon_registry_elements::ALIGNHORIZONTALJUSTIFYCENTER_ELEMENTS,
        ),
        IconType::AlignHorizontalJustifyEnd => {
            Some(crate::icons::common::icon_registry_elements::ALIGNHORIZONTALJUSTIFYEND_ELEMENTS)
        }
        IconType::AlignHorizontalJustifyStart => {
            Some(crate::icons::common::icon_registry_elements::ALIGNHORIZONTALJUSTIFYSTART_ELEMENTS)
        }
        IconType::AlignHorizontalSpaceAround => {
            Some(crate::icons::common::icon_registry_elements::ALIGNHORIZONTALSPACEAROUND_ELEMENTS)
        }
        IconType::AlignHorizontalSpaceBetween => {
            Some(crate::icons::common::icon_registry_elements::ALIGNHORIZONTALSPACEBETWEEN_ELEMENTS)
        }
        IconType::AlignJustify => {
            Some(crate::icons::common::icon_registry_elements::ALIGNJUSTIFY_ELEMENTS)
        }
        IconType::AlignLeft => {
            Some(crate::icons::common::icon_registry_elements::ALIGNLEFT_ELEMENTS)
        }
        IconType::AlignRight => {
            Some(crate::icons::common::icon_registry_elements::ALIGNRIGHT_ELEMENTS)
        }
        IconType::AlignStartHorizontal => {
            Some(crate::icons::common::icon_registry_elements::ALIGNSTARTHORIZONTAL_ELEMENTS)
        }
        IconType::AlignStartVertical => {
            Some(crate::icons::common::icon_registry_elements::ALIGNSTARTVERTICAL_ELEMENTS)
        }
        IconType::AlignVerticalDistributeCenter => Some(
            crate::icons::common::icon_registry_elements::ALIGNVERTICALDISTRIBUTECENTER_ELEMENTS,
        ),
        IconType::AlignVerticalDistributeEnd => {
            Some(crate::icons::common::icon_registry_elements::ALIGNVERTICALDISTRIBUTEEND_ELEMENTS)
        }
        IconType::AlignVerticalDistributeStart => Some(
            crate::icons::common::icon_registry_elements::ALIGNVERTICALDISTRIBUTESTART_ELEMENTS,
        ),
        IconType::AlignVerticalJustifyCenter => {
            Some(crate::icons::common::icon_registry_elements::ALIGNVERTICALJUSTIFYCENTER_ELEMENTS)
        }
        IconType::AlignVerticalJustifyEnd => {
            Some(crate::icons::common::icon_registry_elements::ALIGNVERTICALJUSTIFYEND_ELEMENTS)
        }
        IconType::AlignVerticalJustifyStart => {
            Some(crate::icons::common::icon_registry_elements::ALIGNVERTICALJUSTIFYSTART_ELEMENTS)
        }
        IconType::AlignVerticalSpaceAround => {
            Some(crate::icons::common::icon_registry_elements::ALIGNVERTICALSPACEAROUND_ELEMENTS)
        }
        IconType::AlignVerticalSpaceBetween => {
            Some(crate::icons::common::icon_registry_elements::ALIGNVERTICALSPACEBETWEEN_ELEMENTS)
        }
        IconType::Ambulance => {
            Some(crate::icons::common::icon_registry_elements::AMBULANCE_ELEMENTS)
        }
        IconType::Ampersand => {
            Some(crate::icons::common::icon_registry_elements::AMPERSAND_ELEMENTS)
        }
        IconType::Ampersands => {
            Some(crate::icons::common::icon_registry_elements::AMPERSANDS_ELEMENTS)
        }
        IconType::Amphora => Some(crate::icons::common::icon_registry_elements::AMPHORA_ELEMENTS),
        IconType::Anchor => Some(crate::icons::common::icon_registry_elements::ANCHOR_ELEMENTS),
        IconType::Angry => Some(crate::icons::common::icon_registry_elements::ANGRY_ELEMENTS),
        IconType::Annoyed => Some(crate::icons::common::icon_registry_elements::ANNOYED_ELEMENTS),
        IconType::Antenna => Some(crate::icons::common::icon_registry_elements::ANTENNA_ELEMENTS),
        IconType::Anvil => Some(crate::icons::common::icon_registry_elements::ANVIL_ELEMENTS),
        IconType::Aperture => Some(crate::icons::common::icon_registry_elements::APERTURE_ELEMENTS),
        IconType::AppWindow => {
            Some(crate::icons::common::icon_registry_elements::APPWINDOW_ELEMENTS)
        }
        IconType::AppWindowMac => {
            Some(crate::icons::common::icon_registry_elements::APPWINDOWMAC_ELEMENTS)
        }
        IconType::Apple => Some(crate::icons::common::icon_registry_elements::APPLE_ELEMENTS),
        IconType::Archive => Some(crate::icons::common::icon_registry_elements::ARCHIVE_ELEMENTS),
        IconType::ArchiveRestore => {
            Some(crate::icons::common::icon_registry_elements::ARCHIVERESTORE_ELEMENTS)
        }
        IconType::ArchiveX => Some(crate::icons::common::icon_registry_elements::ARCHIVEX_ELEMENTS),
        IconType::Armchair => Some(crate::icons::common::icon_registry_elements::ARMCHAIR_ELEMENTS),
        IconType::ArrowBigDown => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGDOWN_ELEMENTS)
        }
        IconType::ArrowBigDownDash => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGDOWNDASH_ELEMENTS)
        }
        IconType::ArrowBigLeft => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGLEFT_ELEMENTS)
        }
        IconType::ArrowBigLeftDash => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGLEFTDASH_ELEMENTS)
        }
        IconType::ArrowBigRight => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGRIGHT_ELEMENTS)
        }
        IconType::ArrowBigRightDash => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGRIGHTDASH_ELEMENTS)
        }
        IconType::ArrowBigUp => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGUP_ELEMENTS)
        }
        IconType::ArrowBigUpDash => {
            Some(crate::icons::common::icon_registry_elements::ARROWBIGUPDASH_ELEMENTS)
        }
        IconType::ArrowDown => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWN_ELEMENTS)
        }
        IconType::ArrowDown01 => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWN01_ELEMENTS)
        }
        IconType::ArrowDown10 => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWN10_ELEMENTS)
        }
        IconType::ArrowDownAZ => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNAZ_ELEMENTS)
        }
        IconType::ArrowDownFromLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNFROMLINE_ELEMENTS)
        }
        IconType::ArrowDownLeft => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNLEFT_ELEMENTS)
        }
        IconType::ArrowDownNarrowWide => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNNARROWWIDE_ELEMENTS)
        }
        IconType::ArrowDownRight => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNRIGHT_ELEMENTS)
        }
        IconType::ArrowDownToDot => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNTODOT_ELEMENTS)
        }
        IconType::ArrowDownToLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNTOLINE_ELEMENTS)
        }
        IconType::ArrowDownUp => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNUP_ELEMENTS)
        }
        IconType::ArrowDownWideNarrow => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNWIDENARROW_ELEMENTS)
        }
        IconType::ArrowDownZA => {
            Some(crate::icons::common::icon_registry_elements::ARROWDOWNZA_ELEMENTS)
        }
        IconType::ArrowLeft => {
            Some(crate::icons::common::icon_registry_elements::ARROWLEFT_ELEMENTS)
        }
        IconType::ArrowLeftFromLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWLEFTFROMLINE_ELEMENTS)
        }
        IconType::ArrowLeftRight => {
            Some(crate::icons::common::icon_registry_elements::ARROWLEFTRIGHT_ELEMENTS)
        }
        IconType::ArrowLeftToLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWLEFTTOLINE_ELEMENTS)
        }
        IconType::ArrowRight => {
            Some(crate::icons::common::icon_registry_elements::ARROWRIGHT_ELEMENTS)
        }
        IconType::ArrowRightFromLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWRIGHTFROMLINE_ELEMENTS)
        }
        IconType::ArrowRightLeft => {
            Some(crate::icons::common::icon_registry_elements::ARROWRIGHTLEFT_ELEMENTS)
        }
        IconType::ArrowRightToLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWRIGHTTOLINE_ELEMENTS)
        }
        IconType::ArrowUp => Some(crate::icons::common::icon_registry_elements::ARROWUP_ELEMENTS),
        IconType::ArrowUp01 => {
            Some(crate::icons::common::icon_registry_elements::ARROWUP01_ELEMENTS)
        }
        IconType::ArrowUp10 => {
            Some(crate::icons::common::icon_registry_elements::ARROWUP10_ELEMENTS)
        }
        IconType::ArrowUpAZ => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPAZ_ELEMENTS)
        }
        IconType::ArrowUpDown => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPDOWN_ELEMENTS)
        }
        IconType::ArrowUpFromDot => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPFROMDOT_ELEMENTS)
        }
        IconType::ArrowUpFromLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPFROMLINE_ELEMENTS)
        }
        IconType::ArrowUpLeft => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPLEFT_ELEMENTS)
        }
        IconType::ArrowUpNarrowWide => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPNARROWWIDE_ELEMENTS)
        }
        IconType::ArrowUpRight => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPRIGHT_ELEMENTS)
        }
        IconType::ArrowUpToLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPTOLINE_ELEMENTS)
        }
        IconType::ArrowUpWideNarrow => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPWIDENARROW_ELEMENTS)
        }
        IconType::ArrowUpZA => {
            Some(crate::icons::common::icon_registry_elements::ARROWUPZA_ELEMENTS)
        }
        IconType::ArrowsUpFromLine => {
            Some(crate::icons::common::icon_registry_elements::ARROWSUPFROMLINE_ELEMENTS)
        }
        IconType::Asterisk => Some(crate::icons::common::icon_registry_elements::ASTERISK_ELEMENTS),
        IconType::AtSign => Some(crate::icons::common::icon_registry_elements::ATSIGN_ELEMENTS),
        IconType::Atom => Some(crate::icons::common::icon_registry_elements::ATOM_ELEMENTS),
        IconType::AudioLines => {
            Some(crate::icons::common::icon_registry_elements::AUDIOLINES_ELEMENTS)
        }
        IconType::AudioWaveform => {
            Some(crate::icons::common::icon_registry_elements::AUDIOWAVEFORM_ELEMENTS)
        }
        IconType::Award => Some(crate::icons::common::icon_registry_elements::AWARD_ELEMENTS),
        IconType::Axe => Some(crate::icons::common::icon_registry_elements::AXE_ELEMENTS),
        IconType::Axis3D => Some(crate::icons::common::icon_registry_elements::AXIS3D_ELEMENTS),
        IconType::Baby => Some(crate::icons::common::icon_registry_elements::BABY_ELEMENTS),
        IconType::Backpack => Some(crate::icons::common::icon_registry_elements::BACKPACK_ELEMENTS),
        IconType::Badge => Some(crate::icons::common::icon_registry_elements::BADGE_ELEMENTS),
        IconType::BadgeAlert => {
            Some(crate::icons::common::icon_registry_elements::BADGEALERT_ELEMENTS)
        }
        IconType::BadgeCent => {
            Some(crate::icons::common::icon_registry_elements::BADGECENT_ELEMENTS)
        }
        IconType::BadgeCheck => {
            Some(crate::icons::common::icon_registry_elements::BADGECHECK_ELEMENTS)
        }
        IconType::BadgeDollarSign => {
            Some(crate::icons::common::icon_registry_elements::BADGEDOLLARSIGN_ELEMENTS)
        }
        IconType::BadgeEuro => {
            Some(crate::icons::common::icon_registry_elements::BADGEEURO_ELEMENTS)
        }
        IconType::BadgeHelp => {
            Some(crate::icons::common::icon_registry_elements::BADGEHELP_ELEMENTS)
        }
        IconType::BadgeIndianRupee => {
            Some(crate::icons::common::icon_registry_elements::BADGEINDIANRUPEE_ELEMENTS)
        }
        IconType::BadgeInfo => {
            Some(crate::icons::common::icon_registry_elements::BADGEINFO_ELEMENTS)
        }
        IconType::BadgeJapaneseYen => {
            Some(crate::icons::common::icon_registry_elements::BADGEJAPANESEYEN_ELEMENTS)
        }
        IconType::BadgeMinus => {
            Some(crate::icons::common::icon_registry_elements::BADGEMINUS_ELEMENTS)
        }
        IconType::BadgePercent => {
            Some(crate::icons::common::icon_registry_elements::BADGEPERCENT_ELEMENTS)
        }
        IconType::BadgePlus => {
            Some(crate::icons::common::icon_registry_elements::BADGEPLUS_ELEMENTS)
        }
        IconType::BadgePoundSterling => {
            Some(crate::icons::common::icon_registry_elements::BADGEPOUNDSTERLING_ELEMENTS)
        }
        IconType::BadgeQuestionMark => {
            Some(crate::icons::common::icon_registry_elements::BADGEQUESTIONMARK_ELEMENTS)
        }
        IconType::BadgeRussianRuble => {
            Some(crate::icons::common::icon_registry_elements::BADGERUSSIANRUBLE_ELEMENTS)
        }
        IconType::BadgeSwissFranc => {
            Some(crate::icons::common::icon_registry_elements::BADGESWISSFRANC_ELEMENTS)
        }
        IconType::BadgeTurkishLira => {
            Some(crate::icons::common::icon_registry_elements::BADGETURKISHLIRA_ELEMENTS)
        }
        IconType::BadgeX => Some(crate::icons::common::icon_registry_elements::BADGEX_ELEMENTS),
        IconType::BaggageClaim => {
            Some(crate::icons::common::icon_registry_elements::BAGGAGECLAIM_ELEMENTS)
        }
        IconType::Ban => Some(crate::icons::common::icon_registry_elements::BAN_ELEMENTS),
        IconType::Banana => Some(crate::icons::common::icon_registry_elements::BANANA_ELEMENTS),
        IconType::Bandage => Some(crate::icons::common::icon_registry_elements::BANDAGE_ELEMENTS),
        IconType::Banknote => Some(crate::icons::common::icon_registry_elements::BANKNOTE_ELEMENTS),
        IconType::BanknoteArrowDown => {
            Some(crate::icons::common::icon_registry_elements::BANKNOTEARROWDOWN_ELEMENTS)
        }
        IconType::BanknoteArrowUp => {
            Some(crate::icons::common::icon_registry_elements::BANKNOTEARROWUP_ELEMENTS)
        }
        IconType::BanknoteX => {
            Some(crate::icons::common::icon_registry_elements::BANKNOTEX_ELEMENTS)
        }
        IconType::Barcode => Some(crate::icons::common::icon_registry_elements::BARCODE_ELEMENTS),
        IconType::Barrel => Some(crate::icons::common::icon_registry_elements::BARREL_ELEMENTS),
        IconType::Baseline => Some(crate::icons::common::icon_registry_elements::BASELINE_ELEMENTS),
        IconType::Bath => Some(crate::icons::common::icon_registry_elements::BATH_ELEMENTS),
        IconType::Battery => Some(crate::icons::common::icon_registry_elements::BATTERY_ELEMENTS),
        IconType::BatteryCharging => {
            Some(crate::icons::common::icon_registry_elements::BATTERYCHARGING_ELEMENTS)
        }
        IconType::BatteryFull => {
            Some(crate::icons::common::icon_registry_elements::BATTERYFULL_ELEMENTS)
        }
        IconType::BatteryLow => {
            Some(crate::icons::common::icon_registry_elements::BATTERYLOW_ELEMENTS)
        }
        IconType::BatteryMedium => {
            Some(crate::icons::common::icon_registry_elements::BATTERYMEDIUM_ELEMENTS)
        }
        IconType::BatteryPlus => {
            Some(crate::icons::common::icon_registry_elements::BATTERYPLUS_ELEMENTS)
        }
        IconType::BatteryWarning => {
            Some(crate::icons::common::icon_registry_elements::BATTERYWARNING_ELEMENTS)
        }
        IconType::Beaker => Some(crate::icons::common::icon_registry_elements::BEAKER_ELEMENTS),
        IconType::Bean => Some(crate::icons::common::icon_registry_elements::BEAN_ELEMENTS),
        IconType::BeanOff => Some(crate::icons::common::icon_registry_elements::BEANOFF_ELEMENTS),
        IconType::Bed => Some(crate::icons::common::icon_registry_elements::BED_ELEMENTS),
        IconType::BedDouble => {
            Some(crate::icons::common::icon_registry_elements::BEDDOUBLE_ELEMENTS)
        }
        IconType::BedSingle => {
            Some(crate::icons::common::icon_registry_elements::BEDSINGLE_ELEMENTS)
        }
        IconType::Beef => Some(crate::icons::common::icon_registry_elements::BEEF_ELEMENTS),
        IconType::Beer => Some(crate::icons::common::icon_registry_elements::BEER_ELEMENTS),
        IconType::BeerOff => Some(crate::icons::common::icon_registry_elements::BEEROFF_ELEMENTS),
        IconType::Bell => Some(crate::icons::common::icon_registry_elements::BELL_ELEMENTS),
        IconType::BellDot => Some(crate::icons::common::icon_registry_elements::BELLDOT_ELEMENTS),
        IconType::BellElectric => {
            Some(crate::icons::common::icon_registry_elements::BELLELECTRIC_ELEMENTS)
        }
        IconType::BellMinus => {
            Some(crate::icons::common::icon_registry_elements::BELLMINUS_ELEMENTS)
        }
        IconType::BellOff => Some(crate::icons::common::icon_registry_elements::BELLOFF_ELEMENTS),
        IconType::BellPlus => Some(crate::icons::common::icon_registry_elements::BELLPLUS_ELEMENTS),
        IconType::BellRing => Some(crate::icons::common::icon_registry_elements::BELLRING_ELEMENTS),
        IconType::BetweenHorizontalEnd => {
            Some(crate::icons::common::icon_registry_elements::BETWEENHORIZONTALEND_ELEMENTS)
        }
        IconType::BetweenHorizontalStart => {
            Some(crate::icons::common::icon_registry_elements::BETWEENHORIZONTALSTART_ELEMENTS)
        }
        IconType::BetweenVerticalEnd => {
            Some(crate::icons::common::icon_registry_elements::BETWEENVERTICALEND_ELEMENTS)
        }
        IconType::BetweenVerticalStart => {
            Some(crate::icons::common::icon_registry_elements::BETWEENVERTICALSTART_ELEMENTS)
        }
        IconType::BicepsFlexed => {
            Some(crate::icons::common::icon_registry_elements::BICEPSFLEXED_ELEMENTS)
        }
        IconType::Bike => Some(crate::icons::common::icon_registry_elements::BIKE_ELEMENTS),
        IconType::Binary => Some(crate::icons::common::icon_registry_elements::BINARY_ELEMENTS),
        IconType::Binoculars => {
            Some(crate::icons::common::icon_registry_elements::BINOCULARS_ELEMENTS)
        }
        IconType::Biohazard => {
            Some(crate::icons::common::icon_registry_elements::BIOHAZARD_ELEMENTS)
        }
        IconType::Bird => Some(crate::icons::common::icon_registry_elements::BIRD_ELEMENTS),
        IconType::Bitcoin => Some(crate::icons::common::icon_registry_elements::BITCOIN_ELEMENTS),
        IconType::Blend => Some(crate::icons::common::icon_registry_elements::BLEND_ELEMENTS),
        IconType::Blinds => Some(crate::icons::common::icon_registry_elements::BLINDS_ELEMENTS),
        IconType::Blocks => Some(crate::icons::common::icon_registry_elements::BLOCKS_ELEMENTS),
        IconType::Bluetooth => {
            Some(crate::icons::common::icon_registry_elements::BLUETOOTH_ELEMENTS)
        }
        IconType::BluetoothConnected => {
            Some(crate::icons::common::icon_registry_elements::BLUETOOTHCONNECTED_ELEMENTS)
        }
        IconType::BluetoothOff => {
            Some(crate::icons::common::icon_registry_elements::BLUETOOTHOFF_ELEMENTS)
        }
        IconType::BluetoothSearching => {
            Some(crate::icons::common::icon_registry_elements::BLUETOOTHSEARCHING_ELEMENTS)
        }
        IconType::Bold => Some(crate::icons::common::icon_registry_elements::BOLD_ELEMENTS),
        IconType::Bolt => Some(crate::icons::common::icon_registry_elements::BOLT_ELEMENTS),
        IconType::Bomb => Some(crate::icons::common::icon_registry_elements::BOMB_ELEMENTS),
        IconType::Bone => Some(crate::icons::common::icon_registry_elements::BONE_ELEMENTS),
        IconType::Book => Some(crate::icons::common::icon_registry_elements::BOOK_ELEMENTS),
        IconType::BookA => Some(crate::icons::common::icon_registry_elements::BOOKA_ELEMENTS),
        IconType::BookAlert => {
            Some(crate::icons::common::icon_registry_elements::BOOKALERT_ELEMENTS)
        }
        IconType::BookAudio => {
            Some(crate::icons::common::icon_registry_elements::BOOKAUDIO_ELEMENTS)
        }
        IconType::BookCheck => {
            Some(crate::icons::common::icon_registry_elements::BOOKCHECK_ELEMENTS)
        }
        IconType::BookCopy => Some(crate::icons::common::icon_registry_elements::BOOKCOPY_ELEMENTS),
        IconType::BookDashed => {
            Some(crate::icons::common::icon_registry_elements::BOOKDASHED_ELEMENTS)
        }
        IconType::BookDown => Some(crate::icons::common::icon_registry_elements::BOOKDOWN_ELEMENTS),
        IconType::BookHeadphones => {
            Some(crate::icons::common::icon_registry_elements::BOOKHEADPHONES_ELEMENTS)
        }
        IconType::BookHeart => {
            Some(crate::icons::common::icon_registry_elements::BOOKHEART_ELEMENTS)
        }
        IconType::BookImage => {
            Some(crate::icons::common::icon_registry_elements::BOOKIMAGE_ELEMENTS)
        }
        IconType::BookKey => Some(crate::icons::common::icon_registry_elements::BOOKKEY_ELEMENTS),
        IconType::BookLock => Some(crate::icons::common::icon_registry_elements::BOOKLOCK_ELEMENTS),
        IconType::BookMarked => {
            Some(crate::icons::common::icon_registry_elements::BOOKMARKED_ELEMENTS)
        }
        IconType::BookMinus => {
            Some(crate::icons::common::icon_registry_elements::BOOKMINUS_ELEMENTS)
        }
        IconType::BookOpen => Some(crate::icons::common::icon_registry_elements::BOOKOPEN_ELEMENTS),
        IconType::BookOpenCheck => {
            Some(crate::icons::common::icon_registry_elements::BOOKOPENCHECK_ELEMENTS)
        }
        IconType::BookOpenText => {
            Some(crate::icons::common::icon_registry_elements::BOOKOPENTEXT_ELEMENTS)
        }
        IconType::BookPlus => Some(crate::icons::common::icon_registry_elements::BOOKPLUS_ELEMENTS),
        IconType::BookText => Some(crate::icons::common::icon_registry_elements::BOOKTEXT_ELEMENTS),
        IconType::BookType => Some(crate::icons::common::icon_registry_elements::BOOKTYPE_ELEMENTS),
        IconType::BookUp => Some(crate::icons::common::icon_registry_elements::BOOKUP_ELEMENTS),
        IconType::BookUp2 => Some(crate::icons::common::icon_registry_elements::BOOKUP2_ELEMENTS),
        IconType::BookUser => Some(crate::icons::common::icon_registry_elements::BOOKUSER_ELEMENTS),
        IconType::BookX => Some(crate::icons::common::icon_registry_elements::BOOKX_ELEMENTS),
        IconType::Bookmark => Some(crate::icons::common::icon_registry_elements::BOOKMARK_ELEMENTS),
        IconType::BookmarkCheck => {
            Some(crate::icons::common::icon_registry_elements::BOOKMARKCHECK_ELEMENTS)
        }
        IconType::BookmarkMinus => {
            Some(crate::icons::common::icon_registry_elements::BOOKMARKMINUS_ELEMENTS)
        }
        IconType::BookmarkPlus => {
            Some(crate::icons::common::icon_registry_elements::BOOKMARKPLUS_ELEMENTS)
        }
        IconType::BookmarkX => {
            Some(crate::icons::common::icon_registry_elements::BOOKMARKX_ELEMENTS)
        }
        IconType::BoomBox => Some(crate::icons::common::icon_registry_elements::BOOMBOX_ELEMENTS),
        IconType::Bot => Some(crate::icons::common::icon_registry_elements::BOT_ELEMENTS),
        IconType::BotMessageSquare => {
            Some(crate::icons::common::icon_registry_elements::BOTMESSAGESQUARE_ELEMENTS)
        }
        IconType::BotOff => Some(crate::icons::common::icon_registry_elements::BOTOFF_ELEMENTS),
        IconType::BottleWine => {
            Some(crate::icons::common::icon_registry_elements::BOTTLEWINE_ELEMENTS)
        }
        IconType::BowArrow => Some(crate::icons::common::icon_registry_elements::BOWARROW_ELEMENTS),
        IconType::BoxIcon => Some(crate::icons::common::icon_registry_elements::BOXICON_ELEMENTS),
        IconType::Boxes => Some(crate::icons::common::icon_registry_elements::BOXES_ELEMENTS),
        IconType::Braces => Some(crate::icons::common::icon_registry_elements::BRACES_ELEMENTS),
        IconType::Brackets => Some(crate::icons::common::icon_registry_elements::BRACKETS_ELEMENTS),
        IconType::Brain => Some(crate::icons::common::icon_registry_elements::BRAIN_ELEMENTS),
        IconType::BrainCircuit => {
            Some(crate::icons::common::icon_registry_elements::BRAINCIRCUIT_ELEMENTS)
        }
        IconType::BrainCog => Some(crate::icons::common::icon_registry_elements::BRAINCOG_ELEMENTS),
        IconType::BrickWall => {
            Some(crate::icons::common::icon_registry_elements::BRICKWALL_ELEMENTS)
        }
        IconType::BrickWallFire => {
            Some(crate::icons::common::icon_registry_elements::BRICKWALLFIRE_ELEMENTS)
        }
        IconType::Briefcase => {
            Some(crate::icons::common::icon_registry_elements::BRIEFCASE_ELEMENTS)
        }
        IconType::BriefcaseBusiness => {
            Some(crate::icons::common::icon_registry_elements::BRIEFCASEBUSINESS_ELEMENTS)
        }
        IconType::BriefcaseConveyorBelt => {
            Some(crate::icons::common::icon_registry_elements::BRIEFCASECONVEYORBELT_ELEMENTS)
        }
        IconType::BriefcaseMedical => {
            Some(crate::icons::common::icon_registry_elements::BRIEFCASEMEDICAL_ELEMENTS)
        }
        IconType::BringToFront => {
            Some(crate::icons::common::icon_registry_elements::BRINGTOFRONT_ELEMENTS)
        }
        IconType::Brush => Some(crate::icons::common::icon_registry_elements::BRUSH_ELEMENTS),
        IconType::BrushCleaning => {
            Some(crate::icons::common::icon_registry_elements::BRUSHCLEANING_ELEMENTS)
        }
        IconType::Bubbles => Some(crate::icons::common::icon_registry_elements::BUBBLES_ELEMENTS),
        IconType::Bug => Some(crate::icons::common::icon_registry_elements::BUG_ELEMENTS),
        IconType::BugOff => Some(crate::icons::common::icon_registry_elements::BUGOFF_ELEMENTS),
        IconType::BugPlay => Some(crate::icons::common::icon_registry_elements::BUGPLAY_ELEMENTS),
        IconType::Building => Some(crate::icons::common::icon_registry_elements::BUILDING_ELEMENTS),
        IconType::Building2 => {
            Some(crate::icons::common::icon_registry_elements::BUILDING2_ELEMENTS)
        }
        IconType::Bus => Some(crate::icons::common::icon_registry_elements::BUS_ELEMENTS),
        IconType::BusFront => Some(crate::icons::common::icon_registry_elements::BUSFRONT_ELEMENTS),
        IconType::Cable => Some(crate::icons::common::icon_registry_elements::CABLE_ELEMENTS),
        IconType::CableCar => Some(crate::icons::common::icon_registry_elements::CABLECAR_ELEMENTS),
        IconType::Cake => Some(crate::icons::common::icon_registry_elements::CAKE_ELEMENTS),
        IconType::CakeSlice => {
            Some(crate::icons::common::icon_registry_elements::CAKESLICE_ELEMENTS)
        }
        IconType::Calculator => {
            Some(crate::icons::common::icon_registry_elements::CALCULATOR_ELEMENTS)
        }
        IconType::Calendar => Some(crate::icons::common::icon_registry_elements::CALENDAR_ELEMENTS),
        IconType::Calendar1 => {
            Some(crate::icons::common::icon_registry_elements::CALENDAR1_ELEMENTS)
        }
        IconType::CalendarArrowDown => {
            Some(crate::icons::common::icon_registry_elements::CALENDARARROWDOWN_ELEMENTS)
        }
        IconType::CalendarArrowUp => {
            Some(crate::icons::common::icon_registry_elements::CALENDARARROWUP_ELEMENTS)
        }
        IconType::CalendarCheck => {
            Some(crate::icons::common::icon_registry_elements::CALENDARCHECK_ELEMENTS)
        }
        IconType::CalendarCheck2 => {
            Some(crate::icons::common::icon_registry_elements::CALENDARCHECK2_ELEMENTS)
        }
        IconType::CalendarClock => {
            Some(crate::icons::common::icon_registry_elements::CALENDARCLOCK_ELEMENTS)
        }
        IconType::CalendarCog => {
            Some(crate::icons::common::icon_registry_elements::CALENDARCOG_ELEMENTS)
        }
        IconType::CalendarDays => {
            Some(crate::icons::common::icon_registry_elements::CALENDARDAYS_ELEMENTS)
        }
        IconType::CalendarFold => {
            Some(crate::icons::common::icon_registry_elements::CALENDARFOLD_ELEMENTS)
        }
        IconType::CalendarHeart => {
            Some(crate::icons::common::icon_registry_elements::CALENDARHEART_ELEMENTS)
        }
        IconType::CalendarMinus => {
            Some(crate::icons::common::icon_registry_elements::CALENDARMINUS_ELEMENTS)
        }
        IconType::CalendarMinus2 => {
            Some(crate::icons::common::icon_registry_elements::CALENDARMINUS2_ELEMENTS)
        }
        IconType::CalendarOff => {
            Some(crate::icons::common::icon_registry_elements::CALENDAROFF_ELEMENTS)
        }
        IconType::CalendarPlus => {
            Some(crate::icons::common::icon_registry_elements::CALENDARPLUS_ELEMENTS)
        }
        IconType::CalendarPlus2 => {
            Some(crate::icons::common::icon_registry_elements::CALENDARPLUS2_ELEMENTS)
        }
        IconType::CalendarRange => {
            Some(crate::icons::common::icon_registry_elements::CALENDARRANGE_ELEMENTS)
        }
        IconType::CalendarSearch => {
            Some(crate::icons::common::icon_registry_elements::CALENDARSEARCH_ELEMENTS)
        }
        IconType::CalendarSync => {
            Some(crate::icons::common::icon_registry_elements::CALENDARSYNC_ELEMENTS)
        }
        IconType::CalendarX => {
            Some(crate::icons::common::icon_registry_elements::CALENDARX_ELEMENTS)
        }
        IconType::CalendarX2 => {
            Some(crate::icons::common::icon_registry_elements::CALENDARX2_ELEMENTS)
        }
        IconType::Camera => Some(crate::icons::common::icon_registry_elements::CAMERA_ELEMENTS),
        IconType::CameraOff => {
            Some(crate::icons::common::icon_registry_elements::CAMERAOFF_ELEMENTS)
        }
        IconType::Candy => Some(crate::icons::common::icon_registry_elements::CANDY_ELEMENTS),
        IconType::CandyCane => {
            Some(crate::icons::common::icon_registry_elements::CANDYCANE_ELEMENTS)
        }
        IconType::CandyOff => Some(crate::icons::common::icon_registry_elements::CANDYOFF_ELEMENTS),
        IconType::Cannabis => Some(crate::icons::common::icon_registry_elements::CANNABIS_ELEMENTS),
        IconType::Captions => Some(crate::icons::common::icon_registry_elements::CAPTIONS_ELEMENTS),
        IconType::CaptionsOff => {
            Some(crate::icons::common::icon_registry_elements::CAPTIONSOFF_ELEMENTS)
        }
        IconType::Car => Some(crate::icons::common::icon_registry_elements::CAR_ELEMENTS),
        IconType::CarFront => Some(crate::icons::common::icon_registry_elements::CARFRONT_ELEMENTS),
        IconType::CarTaxiFront => {
            Some(crate::icons::common::icon_registry_elements::CARTAXIFRONT_ELEMENTS)
        }
        IconType::Caravan => Some(crate::icons::common::icon_registry_elements::CARAVAN_ELEMENTS),
        IconType::CardSim => Some(crate::icons::common::icon_registry_elements::CARDSIM_ELEMENTS),
        IconType::Carrot => Some(crate::icons::common::icon_registry_elements::CARROT_ELEMENTS),
        IconType::CaseLower => {
            Some(crate::icons::common::icon_registry_elements::CASELOWER_ELEMENTS)
        }
        IconType::CaseSensitive => {
            Some(crate::icons::common::icon_registry_elements::CASESENSITIVE_ELEMENTS)
        }
        IconType::CaseUpper => {
            Some(crate::icons::common::icon_registry_elements::CASEUPPER_ELEMENTS)
        }
        IconType::CassetteTape => {
            Some(crate::icons::common::icon_registry_elements::CASSETTETAPE_ELEMENTS)
        }
        IconType::Cast => Some(crate::icons::common::icon_registry_elements::CAST_ELEMENTS),
        IconType::Castle => Some(crate::icons::common::icon_registry_elements::CASTLE_ELEMENTS),
        IconType::Cat => Some(crate::icons::common::icon_registry_elements::CAT_ELEMENTS),
        IconType::Cctv => Some(crate::icons::common::icon_registry_elements::CCTV_ELEMENTS),
        IconType::ChartArea => {
            Some(crate::icons::common::icon_registry_elements::CHARTAREA_ELEMENTS)
        }
        IconType::ChartBar => Some(crate::icons::common::icon_registry_elements::CHARTBAR_ELEMENTS),
        IconType::ChartBarBig => {
            Some(crate::icons::common::icon_registry_elements::CHARTBARBIG_ELEMENTS)
        }
        IconType::ChartBarDecreasing => {
            Some(crate::icons::common::icon_registry_elements::CHARTBARDECREASING_ELEMENTS)
        }
        IconType::ChartBarIncreasing => {
            Some(crate::icons::common::icon_registry_elements::CHARTBARINCREASING_ELEMENTS)
        }
        IconType::ChartBarStacked => {
            Some(crate::icons::common::icon_registry_elements::CHARTBARSTACKED_ELEMENTS)
        }
        IconType::ChartCandlestick => {
            Some(crate::icons::common::icon_registry_elements::CHARTCANDLESTICK_ELEMENTS)
        }
        IconType::ChartColumn => {
            Some(crate::icons::common::icon_registry_elements::CHARTCOLUMN_ELEMENTS)
        }
        IconType::ChartColumnBig => {
            Some(crate::icons::common::icon_registry_elements::CHARTCOLUMNBIG_ELEMENTS)
        }
        IconType::ChartColumnDecreasing => {
            Some(crate::icons::common::icon_registry_elements::CHARTCOLUMNDECREASING_ELEMENTS)
        }
        IconType::ChartColumnIncreasing => {
            Some(crate::icons::common::icon_registry_elements::CHARTCOLUMNINCREASING_ELEMENTS)
        }
        IconType::ChartColumnStacked => {
            Some(crate::icons::common::icon_registry_elements::CHARTCOLUMNSTACKED_ELEMENTS)
        }
        IconType::ChartGantt => {
            Some(crate::icons::common::icon_registry_elements::CHARTGANTT_ELEMENTS)
        }
        IconType::ChartLine => {
            Some(crate::icons::common::icon_registry_elements::CHARTLINE_ELEMENTS)
        }
        IconType::ChartNetwork => {
            Some(crate::icons::common::icon_registry_elements::CHARTNETWORK_ELEMENTS)
        }
        IconType::ChartNoAxesColumn => {
            Some(crate::icons::common::icon_registry_elements::CHARTNOAXESCOLUMN_ELEMENTS)
        }
        IconType::ChartNoAxesColumnDecreasing => {
            Some(crate::icons::common::icon_registry_elements::CHARTNOAXESCOLUMNDECREASING_ELEMENTS)
        }
        IconType::ChartNoAxesColumnIncreasing => {
            Some(crate::icons::common::icon_registry_elements::CHARTNOAXESCOLUMNINCREASING_ELEMENTS)
        }
        IconType::ChartNoAxesCombined => {
            Some(crate::icons::common::icon_registry_elements::CHARTNOAXESCOMBINED_ELEMENTS)
        }
        IconType::ChartNoAxesGantt => {
            Some(crate::icons::common::icon_registry_elements::CHARTNOAXESGANTT_ELEMENTS)
        }
        IconType::ChartPie => Some(crate::icons::common::icon_registry_elements::CHARTPIE_ELEMENTS),
        IconType::ChartScatter => {
            Some(crate::icons::common::icon_registry_elements::CHARTSCATTER_ELEMENTS)
        }
        IconType::ChartSpline => {
            Some(crate::icons::common::icon_registry_elements::CHARTSPLINE_ELEMENTS)
        }
        IconType::Check => Some(crate::icons::common::icon_registry_elements::CHECK_ELEMENTS),
        IconType::CheckCheck => {
            Some(crate::icons::common::icon_registry_elements::CHECKCHECK_ELEMENTS)
        }
        IconType::CheckLine => {
            Some(crate::icons::common::icon_registry_elements::CHECKLINE_ELEMENTS)
        }
        IconType::ChefHat => Some(crate::icons::common::icon_registry_elements::CHEFHAT_ELEMENTS),
        IconType::Cherry => Some(crate::icons::common::icon_registry_elements::CHERRY_ELEMENTS),
        IconType::ChevronDown => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONDOWN_ELEMENTS)
        }
        IconType::ChevronFirst => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONFIRST_ELEMENTS)
        }
        IconType::ChevronLast => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONLAST_ELEMENTS)
        }
        IconType::ChevronLeft => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONLEFT_ELEMENTS)
        }
        IconType::ChevronRight => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONRIGHT_ELEMENTS)
        }
        IconType::ChevronUp => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONUP_ELEMENTS)
        }
        IconType::ChevronsDown => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSDOWN_ELEMENTS)
        }
        IconType::ChevronsDownUp => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSDOWNUP_ELEMENTS)
        }
        IconType::ChevronsLeft => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSLEFT_ELEMENTS)
        }
        IconType::ChevronsLeftRight => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSLEFTRIGHT_ELEMENTS)
        }
        IconType::ChevronsLeftRightEllipsis => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSLEFTRIGHTELLIPSIS_ELEMENTS)
        }
        IconType::ChevronsRight => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSRIGHT_ELEMENTS)
        }
        IconType::ChevronsRightLeft => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSRIGHTLEFT_ELEMENTS)
        }
        IconType::ChevronsUp => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSUP_ELEMENTS)
        }
        IconType::ChevronsUpDown => {
            Some(crate::icons::common::icon_registry_elements::CHEVRONSUPDOWN_ELEMENTS)
        }
        IconType::Chrome => Some(crate::icons::common::icon_registry_elements::CHROME_ELEMENTS),
        IconType::Church => Some(crate::icons::common::icon_registry_elements::CHURCH_ELEMENTS),
        IconType::Cigarette => {
            Some(crate::icons::common::icon_registry_elements::CIGARETTE_ELEMENTS)
        }
        IconType::CigaretteOff => {
            Some(crate::icons::common::icon_registry_elements::CIGARETTEOFF_ELEMENTS)
        }
        IconType::Circle => Some(crate::icons::common::icon_registry_elements::CIRCLE_ELEMENTS),
        IconType::CircleAlert => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEALERT_ELEMENTS)
        }
        IconType::CircleArrowDown => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWDOWN_ELEMENTS)
        }
        IconType::CircleArrowLeft => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWLEFT_ELEMENTS)
        }
        IconType::CircleArrowOutDownLeft => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWOUTDOWNLEFT_ELEMENTS)
        }
        IconType::CircleArrowOutDownRight => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWOUTDOWNRIGHT_ELEMENTS)
        }
        IconType::CircleArrowOutUpLeft => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWOUTUPLEFT_ELEMENTS)
        }
        IconType::CircleArrowOutUpRight => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWOUTUPRIGHT_ELEMENTS)
        }
        IconType::CircleArrowRight => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWRIGHT_ELEMENTS)
        }
        IconType::CircleArrowUp => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEARROWUP_ELEMENTS)
        }
        IconType::CircleCheck => {
            Some(crate::icons::common::icon_registry_elements::CIRCLECHECK_ELEMENTS)
        }
        IconType::CircleCheckBig => {
            Some(crate::icons::common::icon_registry_elements::CIRCLECHECKBIG_ELEMENTS)
        }
        IconType::CircleChevronDown => {
            Some(crate::icons::common::icon_registry_elements::CIRCLECHEVRONDOWN_ELEMENTS)
        }
        IconType::CircleChevronLeft => {
            Some(crate::icons::common::icon_registry_elements::CIRCLECHEVRONLEFT_ELEMENTS)
        }
        IconType::CircleChevronRight => {
            Some(crate::icons::common::icon_registry_elements::CIRCLECHEVRONRIGHT_ELEMENTS)
        }
        IconType::CircleChevronUp => {
            Some(crate::icons::common::icon_registry_elements::CIRCLECHEVRONUP_ELEMENTS)
        }
        IconType::CircleDashed => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEDASHED_ELEMENTS)
        }
        IconType::CircleDivide => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEDIVIDE_ELEMENTS)
        }
        IconType::CircleDollarSign => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEDOLLARSIGN_ELEMENTS)
        }
        IconType::CircleDot => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEDOT_ELEMENTS)
        }
        IconType::CircleDotDashed => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEDOTDASHED_ELEMENTS)
        }
        IconType::CircleEllipsis => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEELLIPSIS_ELEMENTS)
        }
        IconType::CircleEqual => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEEQUAL_ELEMENTS)
        }
        IconType::CircleFadingArrowUp => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEFADINGARROWUP_ELEMENTS)
        }
        IconType::CircleFadingPlus => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEFADINGPLUS_ELEMENTS)
        }
        IconType::CircleGauge => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEGAUGE_ELEMENTS)
        }
        IconType::CircleHelp => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEHELP_ELEMENTS)
        }
        IconType::CircleMinus => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEMINUS_ELEMENTS)
        }
        IconType::CircleOff => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEOFF_ELEMENTS)
        }
        IconType::CircleParking => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPARKING_ELEMENTS)
        }
        IconType::CircleParkingOff => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPARKINGOFF_ELEMENTS)
        }
        IconType::CirclePause => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPAUSE_ELEMENTS)
        }
        IconType::CirclePercent => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPERCENT_ELEMENTS)
        }
        IconType::CirclePlay => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPLAY_ELEMENTS)
        }
        IconType::CirclePlus => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPLUS_ELEMENTS)
        }
        IconType::CirclePoundSterling => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPOUNDSTERLING_ELEMENTS)
        }
        IconType::CirclePower => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEPOWER_ELEMENTS)
        }
        IconType::CircleQuestionMark => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEQUESTIONMARK_ELEMENTS)
        }
        IconType::CircleSlash => {
            Some(crate::icons::common::icon_registry_elements::CIRCLESLASH_ELEMENTS)
        }
        IconType::CircleSlash2 => {
            Some(crate::icons::common::icon_registry_elements::CIRCLESLASH2_ELEMENTS)
        }
        IconType::CircleSmall => {
            Some(crate::icons::common::icon_registry_elements::CIRCLESMALL_ELEMENTS)
        }
        IconType::CircleStop => {
            Some(crate::icons::common::icon_registry_elements::CIRCLESTOP_ELEMENTS)
        }
        IconType::CircleUser => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEUSER_ELEMENTS)
        }
        IconType::CircleUserRound => {
            Some(crate::icons::common::icon_registry_elements::CIRCLEUSERROUND_ELEMENTS)
        }
        IconType::CircleX => Some(crate::icons::common::icon_registry_elements::CIRCLEX_ELEMENTS),
        IconType::CircuitBoard => {
            Some(crate::icons::common::icon_registry_elements::CIRCUITBOARD_ELEMENTS)
        }
        IconType::Citrus => Some(crate::icons::common::icon_registry_elements::CITRUS_ELEMENTS),
        IconType::Clapperboard => {
            Some(crate::icons::common::icon_registry_elements::CLAPPERBOARD_ELEMENTS)
        }
        IconType::Clipboard => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARD_ELEMENTS)
        }
        IconType::ClipboardCheck => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDCHECK_ELEMENTS)
        }
        IconType::ClipboardClock => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDCLOCK_ELEMENTS)
        }
        IconType::ClipboardCopy => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDCOPY_ELEMENTS)
        }
        IconType::ClipboardList => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDLIST_ELEMENTS)
        }
        IconType::ClipboardMinus => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDMINUS_ELEMENTS)
        }
        IconType::ClipboardPaste => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDPASTE_ELEMENTS)
        }
        IconType::ClipboardPen => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDPEN_ELEMENTS)
        }
        IconType::ClipboardPenLine => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDPENLINE_ELEMENTS)
        }
        IconType::ClipboardPlus => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDPLUS_ELEMENTS)
        }
        IconType::ClipboardType => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDTYPE_ELEMENTS)
        }
        IconType::ClipboardX => {
            Some(crate::icons::common::icon_registry_elements::CLIPBOARDX_ELEMENTS)
        }
        IconType::Clock => Some(crate::icons::common::icon_registry_elements::CLOCK_ELEMENTS),
        IconType::Clock1 => Some(crate::icons::common::icon_registry_elements::CLOCK1_ELEMENTS),
        IconType::Clock10 => Some(crate::icons::common::icon_registry_elements::CLOCK10_ELEMENTS),
        IconType::Clock11 => Some(crate::icons::common::icon_registry_elements::CLOCK11_ELEMENTS),
        IconType::Clock12 => Some(crate::icons::common::icon_registry_elements::CLOCK12_ELEMENTS),
        IconType::Clock2 => Some(crate::icons::common::icon_registry_elements::CLOCK2_ELEMENTS),
        IconType::Clock3 => Some(crate::icons::common::icon_registry_elements::CLOCK3_ELEMENTS),
        IconType::Clock4 => Some(crate::icons::common::icon_registry_elements::CLOCK4_ELEMENTS),
        IconType::Clock5 => Some(crate::icons::common::icon_registry_elements::CLOCK5_ELEMENTS),
        IconType::Clock6 => Some(crate::icons::common::icon_registry_elements::CLOCK6_ELEMENTS),
        IconType::Clock7 => Some(crate::icons::common::icon_registry_elements::CLOCK7_ELEMENTS),
        IconType::Clock8 => Some(crate::icons::common::icon_registry_elements::CLOCK8_ELEMENTS),
        IconType::Clock9 => Some(crate::icons::common::icon_registry_elements::CLOCK9_ELEMENTS),
        IconType::ClockAlert => {
            Some(crate::icons::common::icon_registry_elements::CLOCKALERT_ELEMENTS)
        }
        IconType::ClockArrowDown => {
            Some(crate::icons::common::icon_registry_elements::CLOCKARROWDOWN_ELEMENTS)
        }
        IconType::ClockArrowUp => {
            Some(crate::icons::common::icon_registry_elements::CLOCKARROWUP_ELEMENTS)
        }
        IconType::ClockFading => {
            Some(crate::icons::common::icon_registry_elements::CLOCKFADING_ELEMENTS)
        }
        IconType::ClockPlus => {
            Some(crate::icons::common::icon_registry_elements::CLOCKPLUS_ELEMENTS)
        }
        IconType::Cloud => Some(crate::icons::common::icon_registry_elements::CLOUD_ELEMENTS),
        IconType::CloudAlert => {
            Some(crate::icons::common::icon_registry_elements::CLOUDALERT_ELEMENTS)
        }
        IconType::CloudCheck => {
            Some(crate::icons::common::icon_registry_elements::CLOUDCHECK_ELEMENTS)
        }
        IconType::CloudCog => Some(crate::icons::common::icon_registry_elements::CLOUDCOG_ELEMENTS),
        IconType::CloudDownload => {
            Some(crate::icons::common::icon_registry_elements::CLOUDDOWNLOAD_ELEMENTS)
        }
        IconType::CloudDrizzle => {
            Some(crate::icons::common::icon_registry_elements::CLOUDDRIZZLE_ELEMENTS)
        }
        IconType::CloudFog => Some(crate::icons::common::icon_registry_elements::CLOUDFOG_ELEMENTS),
        IconType::CloudHail => {
            Some(crate::icons::common::icon_registry_elements::CLOUDHAIL_ELEMENTS)
        }
        IconType::CloudLightning => {
            Some(crate::icons::common::icon_registry_elements::CLOUDLIGHTNING_ELEMENTS)
        }
        IconType::CloudMoon => {
            Some(crate::icons::common::icon_registry_elements::CLOUDMOON_ELEMENTS)
        }
        IconType::CloudMoonRain => {
            Some(crate::icons::common::icon_registry_elements::CLOUDMOONRAIN_ELEMENTS)
        }
        IconType::CloudOff => Some(crate::icons::common::icon_registry_elements::CLOUDOFF_ELEMENTS),
        IconType::CloudRain => {
            Some(crate::icons::common::icon_registry_elements::CLOUDRAIN_ELEMENTS)
        }
        IconType::CloudRainWind => {
            Some(crate::icons::common::icon_registry_elements::CLOUDRAINWIND_ELEMENTS)
        }
        IconType::CloudSnow => {
            Some(crate::icons::common::icon_registry_elements::CLOUDSNOW_ELEMENTS)
        }
        IconType::CloudSun => Some(crate::icons::common::icon_registry_elements::CLOUDSUN_ELEMENTS),
        IconType::CloudSunRain => {
            Some(crate::icons::common::icon_registry_elements::CLOUDSUNRAIN_ELEMENTS)
        }
        IconType::CloudUpload => {
            Some(crate::icons::common::icon_registry_elements::CLOUDUPLOAD_ELEMENTS)
        }
        IconType::Cloudy => Some(crate::icons::common::icon_registry_elements::CLOUDY_ELEMENTS),
        IconType::Clover => Some(crate::icons::common::icon_registry_elements::CLOVER_ELEMENTS),
        IconType::Club => Some(crate::icons::common::icon_registry_elements::CLUB_ELEMENTS),
        IconType::Code => Some(crate::icons::common::icon_registry_elements::CODE_ELEMENTS),
        IconType::CodeXml => Some(crate::icons::common::icon_registry_elements::CODEXML_ELEMENTS),
        IconType::Codepen => Some(crate::icons::common::icon_registry_elements::CODEPEN_ELEMENTS),
        IconType::Codesandbox => {
            Some(crate::icons::common::icon_registry_elements::CODESANDBOX_ELEMENTS)
        }
        IconType::Coffee => Some(crate::icons::common::icon_registry_elements::COFFEE_ELEMENTS),
        IconType::Cog => Some(crate::icons::common::icon_registry_elements::COG_ELEMENTS),
        IconType::Coins => Some(crate::icons::common::icon_registry_elements::COINS_ELEMENTS),
        IconType::Columns2 => Some(crate::icons::common::icon_registry_elements::COLUMNS2_ELEMENTS),
        IconType::Columns3 => Some(crate::icons::common::icon_registry_elements::COLUMNS3_ELEMENTS),
        IconType::Columns3Cog => {
            Some(crate::icons::common::icon_registry_elements::COLUMNS3COG_ELEMENTS)
        }
        IconType::Columns4 => Some(crate::icons::common::icon_registry_elements::COLUMNS4_ELEMENTS),
        IconType::Combine => Some(crate::icons::common::icon_registry_elements::COMBINE_ELEMENTS),
        IconType::Command => Some(crate::icons::common::icon_registry_elements::COMMAND_ELEMENTS),
        IconType::Compass => Some(crate::icons::common::icon_registry_elements::COMPASS_ELEMENTS),
        IconType::Component => {
            Some(crate::icons::common::icon_registry_elements::COMPONENT_ELEMENTS)
        }
        IconType::Computer => Some(crate::icons::common::icon_registry_elements::COMPUTER_ELEMENTS),
        IconType::ConciergeBell => {
            Some(crate::icons::common::icon_registry_elements::CONCIERGEBELL_ELEMENTS)
        }
        IconType::Cone => Some(crate::icons::common::icon_registry_elements::CONE_ELEMENTS),
        IconType::Construction => {
            Some(crate::icons::common::icon_registry_elements::CONSTRUCTION_ELEMENTS)
        }
        IconType::Contact => Some(crate::icons::common::icon_registry_elements::CONTACT_ELEMENTS),
        IconType::ContactRound => {
            Some(crate::icons::common::icon_registry_elements::CONTACTROUND_ELEMENTS)
        }
        IconType::Container => {
            Some(crate::icons::common::icon_registry_elements::CONTAINER_ELEMENTS)
        }
        IconType::Contrast => Some(crate::icons::common::icon_registry_elements::CONTRAST_ELEMENTS),
        IconType::Cookie => Some(crate::icons::common::icon_registry_elements::COOKIE_ELEMENTS),
        IconType::CookingPot => {
            Some(crate::icons::common::icon_registry_elements::COOKINGPOT_ELEMENTS)
        }
        IconType::Copy => Some(crate::icons::common::icon_registry_elements::COPY_ELEMENTS),
        IconType::CopyCheck => {
            Some(crate::icons::common::icon_registry_elements::COPYCHECK_ELEMENTS)
        }
        IconType::CopyMinus => {
            Some(crate::icons::common::icon_registry_elements::COPYMINUS_ELEMENTS)
        }
        IconType::CopyPlus => Some(crate::icons::common::icon_registry_elements::COPYPLUS_ELEMENTS),
        IconType::CopySlash => {
            Some(crate::icons::common::icon_registry_elements::COPYSLASH_ELEMENTS)
        }
        IconType::CopyX => Some(crate::icons::common::icon_registry_elements::COPYX_ELEMENTS),
        IconType::Copyleft => Some(crate::icons::common::icon_registry_elements::COPYLEFT_ELEMENTS),
        IconType::Copyright => {
            Some(crate::icons::common::icon_registry_elements::COPYRIGHT_ELEMENTS)
        }
        IconType::CornerDownLeft => {
            Some(crate::icons::common::icon_registry_elements::CORNERDOWNLEFT_ELEMENTS)
        }
        IconType::CornerDownRight => {
            Some(crate::icons::common::icon_registry_elements::CORNERDOWNRIGHT_ELEMENTS)
        }
        IconType::CornerLeftDown => {
            Some(crate::icons::common::icon_registry_elements::CORNERLEFTDOWN_ELEMENTS)
        }
        IconType::CornerLeftUp => {
            Some(crate::icons::common::icon_registry_elements::CORNERLEFTUP_ELEMENTS)
        }
        IconType::CornerRightDown => {
            Some(crate::icons::common::icon_registry_elements::CORNERRIGHTDOWN_ELEMENTS)
        }
        IconType::CornerRightUp => {
            Some(crate::icons::common::icon_registry_elements::CORNERRIGHTUP_ELEMENTS)
        }
        IconType::CornerUpLeft => {
            Some(crate::icons::common::icon_registry_elements::CORNERUPLEFT_ELEMENTS)
        }
        IconType::CornerUpRight => {
            Some(crate::icons::common::icon_registry_elements::CORNERUPRIGHT_ELEMENTS)
        }
        IconType::Cpu => Some(crate::icons::common::icon_registry_elements::CPU_ELEMENTS),
        IconType::CreativeCommons => {
            Some(crate::icons::common::icon_registry_elements::CREATIVECOMMONS_ELEMENTS)
        }
        IconType::CreditCard => {
            Some(crate::icons::common::icon_registry_elements::CREDITCARD_ELEMENTS)
        }
        IconType::Croissant => {
            Some(crate::icons::common::icon_registry_elements::CROISSANT_ELEMENTS)
        }
        IconType::Crop => Some(crate::icons::common::icon_registry_elements::CROP_ELEMENTS),
        IconType::Cross => Some(crate::icons::common::icon_registry_elements::CROSS_ELEMENTS),
        IconType::Crosshair => {
            Some(crate::icons::common::icon_registry_elements::CROSSHAIR_ELEMENTS)
        }
        IconType::Crown => Some(crate::icons::common::icon_registry_elements::CROWN_ELEMENTS),
        IconType::Cuboid => Some(crate::icons::common::icon_registry_elements::CUBOID_ELEMENTS),
        IconType::CupSoda => Some(crate::icons::common::icon_registry_elements::CUPSODA_ELEMENTS),
        IconType::Currency => Some(crate::icons::common::icon_registry_elements::CURRENCY_ELEMENTS),
        IconType::Cylinder => Some(crate::icons::common::icon_registry_elements::CYLINDER_ELEMENTS),
        IconType::Dam => Some(crate::icons::common::icon_registry_elements::DAM_ELEMENTS),
        IconType::Database => Some(crate::icons::common::icon_registry_elements::DATABASE_ELEMENTS),
        IconType::DatabaseBackup => {
            Some(crate::icons::common::icon_registry_elements::DATABASEBACKUP_ELEMENTS)
        }
        IconType::DatabaseZap => {
            Some(crate::icons::common::icon_registry_elements::DATABASEZAP_ELEMENTS)
        }
        IconType::DecimalsArrowLeft => {
            Some(crate::icons::common::icon_registry_elements::DECIMALSARROWLEFT_ELEMENTS)
        }
        IconType::DecimalsArrowRight => {
            Some(crate::icons::common::icon_registry_elements::DECIMALSARROWRIGHT_ELEMENTS)
        }
        IconType::Delete => Some(crate::icons::common::icon_registry_elements::DELETE_ELEMENTS),
        IconType::Dessert => Some(crate::icons::common::icon_registry_elements::DESSERT_ELEMENTS),
        IconType::Diameter => Some(crate::icons::common::icon_registry_elements::DIAMETER_ELEMENTS),
        IconType::Diamond => Some(crate::icons::common::icon_registry_elements::DIAMOND_ELEMENTS),
        IconType::DiamondMinus => {
            Some(crate::icons::common::icon_registry_elements::DIAMONDMINUS_ELEMENTS)
        }
        IconType::DiamondPercent => {
            Some(crate::icons::common::icon_registry_elements::DIAMONDPERCENT_ELEMENTS)
        }
        IconType::DiamondPlus => {
            Some(crate::icons::common::icon_registry_elements::DIAMONDPLUS_ELEMENTS)
        }
        IconType::Dice1 => Some(crate::icons::common::icon_registry_elements::DICE1_ELEMENTS),
        IconType::Dice2 => Some(crate::icons::common::icon_registry_elements::DICE2_ELEMENTS),
        IconType::Dice3 => Some(crate::icons::common::icon_registry_elements::DICE3_ELEMENTS),
        IconType::Dice4 => Some(crate::icons::common::icon_registry_elements::DICE4_ELEMENTS),
        IconType::Dice5 => Some(crate::icons::common::icon_registry_elements::DICE5_ELEMENTS),
        IconType::Dice6 => Some(crate::icons::common::icon_registry_elements::DICE6_ELEMENTS),
        IconType::Dices => Some(crate::icons::common::icon_registry_elements::DICES_ELEMENTS),
        IconType::Diff => Some(crate::icons::common::icon_registry_elements::DIFF_ELEMENTS),
        IconType::Disc => Some(crate::icons::common::icon_registry_elements::DISC_ELEMENTS),
        IconType::Disc2 => Some(crate::icons::common::icon_registry_elements::DISC2_ELEMENTS),
        IconType::Disc3 => Some(crate::icons::common::icon_registry_elements::DISC3_ELEMENTS),
        IconType::DiscAlbum => {
            Some(crate::icons::common::icon_registry_elements::DISCALBUM_ELEMENTS)
        }
        IconType::Divide => Some(crate::icons::common::icon_registry_elements::DIVIDE_ELEMENTS),
        IconType::Dna => Some(crate::icons::common::icon_registry_elements::DNA_ELEMENTS),
        IconType::DnaOff => Some(crate::icons::common::icon_registry_elements::DNAOFF_ELEMENTS),
        IconType::Dock => Some(crate::icons::common::icon_registry_elements::DOCK_ELEMENTS),
        IconType::Dog => Some(crate::icons::common::icon_registry_elements::DOG_ELEMENTS),
        IconType::DollarSign => {
            Some(crate::icons::common::icon_registry_elements::DOLLARSIGN_ELEMENTS)
        }
        IconType::Donut => Some(crate::icons::common::icon_registry_elements::DONUT_ELEMENTS),
        IconType::DoorClosed => {
            Some(crate::icons::common::icon_registry_elements::DOORCLOSED_ELEMENTS)
        }
        IconType::DoorClosedLocked => {
            Some(crate::icons::common::icon_registry_elements::DOORCLOSEDLOCKED_ELEMENTS)
        }
        IconType::DoorOpen => Some(crate::icons::common::icon_registry_elements::DOOROPEN_ELEMENTS),
        IconType::Dot => Some(crate::icons::common::icon_registry_elements::DOT_ELEMENTS),
        IconType::Download => Some(crate::icons::common::icon_registry_elements::DOWNLOAD_ELEMENTS),
        IconType::DraftingCompass => {
            Some(crate::icons::common::icon_registry_elements::DRAFTINGCOMPASS_ELEMENTS)
        }
        IconType::Drama => Some(crate::icons::common::icon_registry_elements::DRAMA_ELEMENTS),
        IconType::Dribbble => Some(crate::icons::common::icon_registry_elements::DRIBBBLE_ELEMENTS),
        IconType::Drill => Some(crate::icons::common::icon_registry_elements::DRILL_ELEMENTS),
        IconType::Drone => Some(crate::icons::common::icon_registry_elements::DRONE_ELEMENTS),
        IconType::Droplet => Some(crate::icons::common::icon_registry_elements::DROPLET_ELEMENTS),
        IconType::DropletOff => {
            Some(crate::icons::common::icon_registry_elements::DROPLETOFF_ELEMENTS)
        }
        IconType::Droplets => Some(crate::icons::common::icon_registry_elements::DROPLETS_ELEMENTS),
        IconType::Drum => Some(crate::icons::common::icon_registry_elements::DRUM_ELEMENTS),
        IconType::Drumstick => {
            Some(crate::icons::common::icon_registry_elements::DRUMSTICK_ELEMENTS)
        }
        IconType::Dumbbell => Some(crate::icons::common::icon_registry_elements::DUMBBELL_ELEMENTS),
        IconType::Ear => Some(crate::icons::common::icon_registry_elements::EAR_ELEMENTS),
        IconType::EarOff => Some(crate::icons::common::icon_registry_elements::EAROFF_ELEMENTS),
        IconType::Earth => Some(crate::icons::common::icon_registry_elements::EARTH_ELEMENTS),
        IconType::EarthLock => {
            Some(crate::icons::common::icon_registry_elements::EARTHLOCK_ELEMENTS)
        }
        IconType::Eclipse => Some(crate::icons::common::icon_registry_elements::ECLIPSE_ELEMENTS),
        IconType::Egg => Some(crate::icons::common::icon_registry_elements::EGG_ELEMENTS),
        IconType::EggFried => Some(crate::icons::common::icon_registry_elements::EGGFRIED_ELEMENTS),
        IconType::EggOff => Some(crate::icons::common::icon_registry_elements::EGGOFF_ELEMENTS),
        IconType::Ellipsis => Some(crate::icons::common::icon_registry_elements::ELLIPSIS_ELEMENTS),
        IconType::EllipsisVertical => {
            Some(crate::icons::common::icon_registry_elements::ELLIPSISVERTICAL_ELEMENTS)
        }
        IconType::Equal => Some(crate::icons::common::icon_registry_elements::EQUAL_ELEMENTS),
        IconType::EqualApproximately => {
            Some(crate::icons::common::icon_registry_elements::EQUALAPPROXIMATELY_ELEMENTS)
        }
        IconType::EqualNot => Some(crate::icons::common::icon_registry_elements::EQUALNOT_ELEMENTS),
        IconType::Eraser => Some(crate::icons::common::icon_registry_elements::ERASER_ELEMENTS),
        IconType::EthernetPort => {
            Some(crate::icons::common::icon_registry_elements::ETHERNETPORT_ELEMENTS)
        }
        IconType::Euro => Some(crate::icons::common::icon_registry_elements::EURO_ELEMENTS),
        IconType::Expand => Some(crate::icons::common::icon_registry_elements::EXPAND_ELEMENTS),
        IconType::ExternalLink => {
            Some(crate::icons::common::icon_registry_elements::EXTERNALLINK_ELEMENTS)
        }
        IconType::Eye => Some(crate::icons::common::icon_registry_elements::EYE_ELEMENTS),
        IconType::EyeClosed => {
            Some(crate::icons::common::icon_registry_elements::EYECLOSED_ELEMENTS)
        }
        IconType::EyeOff => Some(crate::icons::common::icon_registry_elements::EYEOFF_ELEMENTS),
        IconType::Facebook => Some(crate::icons::common::icon_registry_elements::FACEBOOK_ELEMENTS),
        IconType::Factory => Some(crate::icons::common::icon_registry_elements::FACTORY_ELEMENTS),
        IconType::Fan => Some(crate::icons::common::icon_registry_elements::FAN_ELEMENTS),
        IconType::FastForward => {
            Some(crate::icons::common::icon_registry_elements::FASTFORWARD_ELEMENTS)
        }
        IconType::Feather => Some(crate::icons::common::icon_registry_elements::FEATHER_ELEMENTS),
        IconType::Fence => Some(crate::icons::common::icon_registry_elements::FENCE_ELEMENTS),
        IconType::FerrisWheel => {
            Some(crate::icons::common::icon_registry_elements::FERRISWHEEL_ELEMENTS)
        }
        IconType::Figma => Some(crate::icons::common::icon_registry_elements::FIGMA_ELEMENTS),
        IconType::File => Some(crate::icons::common::icon_registry_elements::FILE_ELEMENTS),
        IconType::FileArchive => {
            Some(crate::icons::common::icon_registry_elements::FILEARCHIVE_ELEMENTS)
        }
        IconType::FileAudio => {
            Some(crate::icons::common::icon_registry_elements::FILEAUDIO_ELEMENTS)
        }
        IconType::FileAudio2 => {
            Some(crate::icons::common::icon_registry_elements::FILEAUDIO2_ELEMENTS)
        }
        IconType::FileAxis3D => {
            Some(crate::icons::common::icon_registry_elements::FILEAXIS3D_ELEMENTS)
        }
        IconType::FileBadge => {
            Some(crate::icons::common::icon_registry_elements::FILEBADGE_ELEMENTS)
        }
        IconType::FileBadge2 => {
            Some(crate::icons::common::icon_registry_elements::FILEBADGE2_ELEMENTS)
        }
        IconType::FileBox => Some(crate::icons::common::icon_registry_elements::FILEBOX_ELEMENTS),
        IconType::FileChartColumn => {
            Some(crate::icons::common::icon_registry_elements::FILECHARTCOLUMN_ELEMENTS)
        }
        IconType::FileChartColumnIncreasing => {
            Some(crate::icons::common::icon_registry_elements::FILECHARTCOLUMNINCREASING_ELEMENTS)
        }
        IconType::FileChartLine => {
            Some(crate::icons::common::icon_registry_elements::FILECHARTLINE_ELEMENTS)
        }
        IconType::FileChartPie => {
            Some(crate::icons::common::icon_registry_elements::FILECHARTPIE_ELEMENTS)
        }
        IconType::FileCheck => {
            Some(crate::icons::common::icon_registry_elements::FILECHECK_ELEMENTS)
        }
        IconType::FileCheck2 => {
            Some(crate::icons::common::icon_registry_elements::FILECHECK2_ELEMENTS)
        }
        IconType::FileClock => {
            Some(crate::icons::common::icon_registry_elements::FILECLOCK_ELEMENTS)
        }
        IconType::FileCode => Some(crate::icons::common::icon_registry_elements::FILECODE_ELEMENTS),
        IconType::FileCode2 => {
            Some(crate::icons::common::icon_registry_elements::FILECODE2_ELEMENTS)
        }
        IconType::FileCog => Some(crate::icons::common::icon_registry_elements::FILECOG_ELEMENTS),
        IconType::FileDiff => Some(crate::icons::common::icon_registry_elements::FILEDIFF_ELEMENTS),
        IconType::FileDigit => {
            Some(crate::icons::common::icon_registry_elements::FILEDIGIT_ELEMENTS)
        }
        IconType::FileDown => Some(crate::icons::common::icon_registry_elements::FILEDOWN_ELEMENTS),
        IconType::FileHeart => {
            Some(crate::icons::common::icon_registry_elements::FILEHEART_ELEMENTS)
        }
        IconType::FileImage => {
            Some(crate::icons::common::icon_registry_elements::FILEIMAGE_ELEMENTS)
        }
        IconType::FileInput => {
            Some(crate::icons::common::icon_registry_elements::FILEINPUT_ELEMENTS)
        }
        IconType::FileJson => Some(crate::icons::common::icon_registry_elements::FILEJSON_ELEMENTS),
        IconType::FileJson2 => {
            Some(crate::icons::common::icon_registry_elements::FILEJSON2_ELEMENTS)
        }
        IconType::FileKey => Some(crate::icons::common::icon_registry_elements::FILEKEY_ELEMENTS),
        IconType::FileKey2 => Some(crate::icons::common::icon_registry_elements::FILEKEY2_ELEMENTS),
        IconType::FileLock => Some(crate::icons::common::icon_registry_elements::FILELOCK_ELEMENTS),
        IconType::FileLock2 => {
            Some(crate::icons::common::icon_registry_elements::FILELOCK2_ELEMENTS)
        }
        IconType::FileMinus => {
            Some(crate::icons::common::icon_registry_elements::FILEMINUS_ELEMENTS)
        }
        IconType::FileMinus2 => {
            Some(crate::icons::common::icon_registry_elements::FILEMINUS2_ELEMENTS)
        }
        IconType::FileMusic => {
            Some(crate::icons::common::icon_registry_elements::FILEMUSIC_ELEMENTS)
        }
        IconType::FileOutput => {
            Some(crate::icons::common::icon_registry_elements::FILEOUTPUT_ELEMENTS)
        }
        IconType::FilePen => Some(crate::icons::common::icon_registry_elements::FILEPEN_ELEMENTS),
        IconType::FilePenLine => {
            Some(crate::icons::common::icon_registry_elements::FILEPENLINE_ELEMENTS)
        }
        IconType::FilePlay => Some(crate::icons::common::icon_registry_elements::FILEPLAY_ELEMENTS),
        IconType::FilePlus => Some(crate::icons::common::icon_registry_elements::FILEPLUS_ELEMENTS),
        IconType::FilePlus2 => {
            Some(crate::icons::common::icon_registry_elements::FILEPLUS2_ELEMENTS)
        }
        IconType::FileQuestion => {
            Some(crate::icons::common::icon_registry_elements::FILEQUESTION_ELEMENTS)
        }
        IconType::FileQuestionMark => {
            Some(crate::icons::common::icon_registry_elements::FILEQUESTIONMARK_ELEMENTS)
        }
        IconType::FileScan => Some(crate::icons::common::icon_registry_elements::FILESCAN_ELEMENTS),
        IconType::FileSearch => {
            Some(crate::icons::common::icon_registry_elements::FILESEARCH_ELEMENTS)
        }
        IconType::FileSearch2 => {
            Some(crate::icons::common::icon_registry_elements::FILESEARCH2_ELEMENTS)
        }
        IconType::FileSliders => {
            Some(crate::icons::common::icon_registry_elements::FILESLIDERS_ELEMENTS)
        }
        IconType::FileSpreadsheet => {
            Some(crate::icons::common::icon_registry_elements::FILESPREADSHEET_ELEMENTS)
        }
        IconType::FileStack => {
            Some(crate::icons::common::icon_registry_elements::FILESTACK_ELEMENTS)
        }
        IconType::FileSymlink => {
            Some(crate::icons::common::icon_registry_elements::FILESYMLINK_ELEMENTS)
        }
        IconType::FileTerminal => {
            Some(crate::icons::common::icon_registry_elements::FILETERMINAL_ELEMENTS)
        }
        IconType::FileText => Some(crate::icons::common::icon_registry_elements::FILETEXT_ELEMENTS),
        IconType::FileType => Some(crate::icons::common::icon_registry_elements::FILETYPE_ELEMENTS),
        IconType::FileType2 => {
            Some(crate::icons::common::icon_registry_elements::FILETYPE2_ELEMENTS)
        }
        IconType::FileUp => Some(crate::icons::common::icon_registry_elements::FILEUP_ELEMENTS),
        IconType::FileUser => Some(crate::icons::common::icon_registry_elements::FILEUSER_ELEMENTS),
        IconType::FileVideo => {
            Some(crate::icons::common::icon_registry_elements::FILEVIDEO_ELEMENTS)
        }
        IconType::FileVideo2 => {
            Some(crate::icons::common::icon_registry_elements::FILEVIDEO2_ELEMENTS)
        }
        IconType::FileVideoCamera => {
            Some(crate::icons::common::icon_registry_elements::FILEVIDEOCAMERA_ELEMENTS)
        }
        IconType::FileVolume => {
            Some(crate::icons::common::icon_registry_elements::FILEVOLUME_ELEMENTS)
        }
        IconType::FileVolume2 => {
            Some(crate::icons::common::icon_registry_elements::FILEVOLUME2_ELEMENTS)
        }
        IconType::FileWarning => {
            Some(crate::icons::common::icon_registry_elements::FILEWARNING_ELEMENTS)
        }
        IconType::FileX => Some(crate::icons::common::icon_registry_elements::FILEX_ELEMENTS),
        IconType::FileX2 => Some(crate::icons::common::icon_registry_elements::FILEX2_ELEMENTS),
        IconType::Files => Some(crate::icons::common::icon_registry_elements::FILES_ELEMENTS),
        IconType::Film => Some(crate::icons::common::icon_registry_elements::FILM_ELEMENTS),
        IconType::Filter => Some(crate::icons::common::icon_registry_elements::FILTER_ELEMENTS),
        IconType::FilterX => Some(crate::icons::common::icon_registry_elements::FILTERX_ELEMENTS),
        IconType::Fingerprint => {
            Some(crate::icons::common::icon_registry_elements::FINGERPRINT_ELEMENTS)
        }
        IconType::FireExtinguisher => {
            Some(crate::icons::common::icon_registry_elements::FIREEXTINGUISHER_ELEMENTS)
        }
        IconType::Fish => Some(crate::icons::common::icon_registry_elements::FISH_ELEMENTS),
        IconType::FishOff => Some(crate::icons::common::icon_registry_elements::FISHOFF_ELEMENTS),
        IconType::FishSymbol => {
            Some(crate::icons::common::icon_registry_elements::FISHSYMBOL_ELEMENTS)
        }
        IconType::Flag => Some(crate::icons::common::icon_registry_elements::FLAG_ELEMENTS),
        IconType::FlagOff => Some(crate::icons::common::icon_registry_elements::FLAGOFF_ELEMENTS),
        IconType::FlagTriangleLeft => {
            Some(crate::icons::common::icon_registry_elements::FLAGTRIANGLELEFT_ELEMENTS)
        }
        IconType::FlagTriangleRight => {
            Some(crate::icons::common::icon_registry_elements::FLAGTRIANGLERIGHT_ELEMENTS)
        }
        IconType::Flame => Some(crate::icons::common::icon_registry_elements::FLAME_ELEMENTS),
        IconType::FlameKindling => {
            Some(crate::icons::common::icon_registry_elements::FLAMEKINDLING_ELEMENTS)
        }
        IconType::Flashlight => {
            Some(crate::icons::common::icon_registry_elements::FLASHLIGHT_ELEMENTS)
        }
        IconType::FlashlightOff => {
            Some(crate::icons::common::icon_registry_elements::FLASHLIGHTOFF_ELEMENTS)
        }
        IconType::FlaskConical => {
            Some(crate::icons::common::icon_registry_elements::FLASKCONICAL_ELEMENTS)
        }
        IconType::FlaskConicalOff => {
            Some(crate::icons::common::icon_registry_elements::FLASKCONICALOFF_ELEMENTS)
        }
        IconType::FlaskRound => {
            Some(crate::icons::common::icon_registry_elements::FLASKROUND_ELEMENTS)
        }
        IconType::FlipHorizontal => {
            Some(crate::icons::common::icon_registry_elements::FLIPHORIZONTAL_ELEMENTS)
        }
        IconType::FlipHorizontal2 => {
            Some(crate::icons::common::icon_registry_elements::FLIPHORIZONTAL2_ELEMENTS)
        }
        IconType::FlipVertical => {
            Some(crate::icons::common::icon_registry_elements::FLIPVERTICAL_ELEMENTS)
        }
        IconType::FlipVertical2 => {
            Some(crate::icons::common::icon_registry_elements::FLIPVERTICAL2_ELEMENTS)
        }
        IconType::Flower => Some(crate::icons::common::icon_registry_elements::FLOWER_ELEMENTS),
        IconType::Flower2 => Some(crate::icons::common::icon_registry_elements::FLOWER2_ELEMENTS),
        IconType::Focus => Some(crate::icons::common::icon_registry_elements::FOCUS_ELEMENTS),
        IconType::FoldHorizontal => {
            Some(crate::icons::common::icon_registry_elements::FOLDHORIZONTAL_ELEMENTS)
        }
        IconType::FoldVertical => {
            Some(crate::icons::common::icon_registry_elements::FOLDVERTICAL_ELEMENTS)
        }
        IconType::Folder => Some(crate::icons::common::icon_registry_elements::FOLDER_ELEMENTS),
        IconType::FolderArchive => {
            Some(crate::icons::common::icon_registry_elements::FOLDERARCHIVE_ELEMENTS)
        }
        IconType::FolderCheck => {
            Some(crate::icons::common::icon_registry_elements::FOLDERCHECK_ELEMENTS)
        }
        IconType::FolderClock => {
            Some(crate::icons::common::icon_registry_elements::FOLDERCLOCK_ELEMENTS)
        }
        IconType::FolderClosed => {
            Some(crate::icons::common::icon_registry_elements::FOLDERCLOSED_ELEMENTS)
        }
        IconType::FolderCode => {
            Some(crate::icons::common::icon_registry_elements::FOLDERCODE_ELEMENTS)
        }
        IconType::FolderCog => {
            Some(crate::icons::common::icon_registry_elements::FOLDERCOG_ELEMENTS)
        }
        IconType::FolderDot => {
            Some(crate::icons::common::icon_registry_elements::FOLDERDOT_ELEMENTS)
        }
        IconType::FolderDown => {
            Some(crate::icons::common::icon_registry_elements::FOLDERDOWN_ELEMENTS)
        }
        IconType::FolderGit => {
            Some(crate::icons::common::icon_registry_elements::FOLDERGIT_ELEMENTS)
        }
        IconType::FolderGit2 => {
            Some(crate::icons::common::icon_registry_elements::FOLDERGIT2_ELEMENTS)
        }
        IconType::FolderHeart => {
            Some(crate::icons::common::icon_registry_elements::FOLDERHEART_ELEMENTS)
        }
        IconType::FolderInput => {
            Some(crate::icons::common::icon_registry_elements::FOLDERINPUT_ELEMENTS)
        }
        IconType::FolderKanban => {
            Some(crate::icons::common::icon_registry_elements::FOLDERKANBAN_ELEMENTS)
        }
        IconType::FolderKey => {
            Some(crate::icons::common::icon_registry_elements::FOLDERKEY_ELEMENTS)
        }
        IconType::FolderLock => {
            Some(crate::icons::common::icon_registry_elements::FOLDERLOCK_ELEMENTS)
        }
        IconType::FolderMinus => {
            Some(crate::icons::common::icon_registry_elements::FOLDERMINUS_ELEMENTS)
        }
        IconType::FolderOpen => {
            Some(crate::icons::common::icon_registry_elements::FOLDEROPEN_ELEMENTS)
        }
        IconType::FolderOpenDot => {
            Some(crate::icons::common::icon_registry_elements::FOLDEROPENDOT_ELEMENTS)
        }
        IconType::FolderOutput => {
            Some(crate::icons::common::icon_registry_elements::FOLDEROUTPUT_ELEMENTS)
        }
        IconType::FolderPen => {
            Some(crate::icons::common::icon_registry_elements::FOLDERPEN_ELEMENTS)
        }
        IconType::FolderPlus => {
            Some(crate::icons::common::icon_registry_elements::FOLDERPLUS_ELEMENTS)
        }
        IconType::FolderRoot => {
            Some(crate::icons::common::icon_registry_elements::FOLDERROOT_ELEMENTS)
        }
        IconType::FolderSearch => {
            Some(crate::icons::common::icon_registry_elements::FOLDERSEARCH_ELEMENTS)
        }
        IconType::FolderSearch2 => {
            Some(crate::icons::common::icon_registry_elements::FOLDERSEARCH2_ELEMENTS)
        }
        IconType::FolderSymlink => {
            Some(crate::icons::common::icon_registry_elements::FOLDERSYMLINK_ELEMENTS)
        }
        IconType::FolderSync => {
            Some(crate::icons::common::icon_registry_elements::FOLDERSYNC_ELEMENTS)
        }
        IconType::FolderTree => {
            Some(crate::icons::common::icon_registry_elements::FOLDERTREE_ELEMENTS)
        }
        IconType::FolderUp => Some(crate::icons::common::icon_registry_elements::FOLDERUP_ELEMENTS),
        IconType::FolderX => Some(crate::icons::common::icon_registry_elements::FOLDERX_ELEMENTS),
        IconType::Folders => Some(crate::icons::common::icon_registry_elements::FOLDERS_ELEMENTS),
        IconType::Footprints => {
            Some(crate::icons::common::icon_registry_elements::FOOTPRINTS_ELEMENTS)
        }
        IconType::Forklift => Some(crate::icons::common::icon_registry_elements::FORKLIFT_ELEMENTS),
        IconType::Forward => Some(crate::icons::common::icon_registry_elements::FORWARD_ELEMENTS),
        IconType::Frame => Some(crate::icons::common::icon_registry_elements::FRAME_ELEMENTS),
        IconType::Framer => Some(crate::icons::common::icon_registry_elements::FRAMER_ELEMENTS),
        IconType::Frown => Some(crate::icons::common::icon_registry_elements::FROWN_ELEMENTS),
        IconType::Fuel => Some(crate::icons::common::icon_registry_elements::FUEL_ELEMENTS),
        IconType::Fullscreen => {
            Some(crate::icons::common::icon_registry_elements::FULLSCREEN_ELEMENTS)
        }
        IconType::Funnel => Some(crate::icons::common::icon_registry_elements::FUNNEL_ELEMENTS),
        IconType::FunnelPlus => {
            Some(crate::icons::common::icon_registry_elements::FUNNELPLUS_ELEMENTS)
        }
        IconType::FunnelX => Some(crate::icons::common::icon_registry_elements::FUNNELX_ELEMENTS),
        IconType::GalleryHorizontal => {
            Some(crate::icons::common::icon_registry_elements::GALLERYHORIZONTAL_ELEMENTS)
        }
        IconType::GalleryHorizontalEnd => {
            Some(crate::icons::common::icon_registry_elements::GALLERYHORIZONTALEND_ELEMENTS)
        }
        IconType::GalleryThumbnails => {
            Some(crate::icons::common::icon_registry_elements::GALLERYTHUMBNAILS_ELEMENTS)
        }
        IconType::GalleryVertical => {
            Some(crate::icons::common::icon_registry_elements::GALLERYVERTICAL_ELEMENTS)
        }
        IconType::GalleryVerticalEnd => {
            Some(crate::icons::common::icon_registry_elements::GALLERYVERTICALEND_ELEMENTS)
        }
        IconType::Gamepad => Some(crate::icons::common::icon_registry_elements::GAMEPAD_ELEMENTS),
        IconType::Gamepad2 => Some(crate::icons::common::icon_registry_elements::GAMEPAD2_ELEMENTS),
        IconType::Gauge => Some(crate::icons::common::icon_registry_elements::GAUGE_ELEMENTS),
        IconType::Gavel => Some(crate::icons::common::icon_registry_elements::GAVEL_ELEMENTS),
        IconType::Gem => Some(crate::icons::common::icon_registry_elements::GEM_ELEMENTS),
        IconType::GeorgianLari => {
            Some(crate::icons::common::icon_registry_elements::GEORGIANLARI_ELEMENTS)
        }
        IconType::Ghost => Some(crate::icons::common::icon_registry_elements::GHOST_ELEMENTS),
        IconType::Gift => Some(crate::icons::common::icon_registry_elements::GIFT_ELEMENTS),
        IconType::GitBranch => {
            Some(crate::icons::common::icon_registry_elements::GITBRANCH_ELEMENTS)
        }
        IconType::GitBranchPlus => {
            Some(crate::icons::common::icon_registry_elements::GITBRANCHPLUS_ELEMENTS)
        }
        IconType::GitCommitHorizontal => {
            Some(crate::icons::common::icon_registry_elements::GITCOMMITHORIZONTAL_ELEMENTS)
        }
        IconType::GitCommitVertical => {
            Some(crate::icons::common::icon_registry_elements::GITCOMMITVERTICAL_ELEMENTS)
        }
        IconType::GitCompare => {
            Some(crate::icons::common::icon_registry_elements::GITCOMPARE_ELEMENTS)
        }
        IconType::GitCompareArrows => {
            Some(crate::icons::common::icon_registry_elements::GITCOMPAREARROWS_ELEMENTS)
        }
        IconType::GitFork => Some(crate::icons::common::icon_registry_elements::GITFORK_ELEMENTS),
        IconType::GitGraph => Some(crate::icons::common::icon_registry_elements::GITGRAPH_ELEMENTS),
        IconType::GitMerge => Some(crate::icons::common::icon_registry_elements::GITMERGE_ELEMENTS),
        IconType::GitPullRequest => {
            Some(crate::icons::common::icon_registry_elements::GITPULLREQUEST_ELEMENTS)
        }
        IconType::GitPullRequestArrow => {
            Some(crate::icons::common::icon_registry_elements::GITPULLREQUESTARROW_ELEMENTS)
        }
        IconType::GitPullRequestClosed => {
            Some(crate::icons::common::icon_registry_elements::GITPULLREQUESTCLOSED_ELEMENTS)
        }
        IconType::GitPullRequestCreate => {
            Some(crate::icons::common::icon_registry_elements::GITPULLREQUESTCREATE_ELEMENTS)
        }
        IconType::GitPullRequestCreateArrow => {
            Some(crate::icons::common::icon_registry_elements::GITPULLREQUESTCREATEARROW_ELEMENTS)
        }
        IconType::GitPullRequestDraft => {
            Some(crate::icons::common::icon_registry_elements::GITPULLREQUESTDRAFT_ELEMENTS)
        }
        IconType::Github => Some(crate::icons::common::icon_registry_elements::GITHUB_ELEMENTS),
        IconType::Gitlab => Some(crate::icons::common::icon_registry_elements::GITLAB_ELEMENTS),
        IconType::GlassWater => {
            Some(crate::icons::common::icon_registry_elements::GLASSWATER_ELEMENTS)
        }
        IconType::Glasses => Some(crate::icons::common::icon_registry_elements::GLASSES_ELEMENTS),
        IconType::Globe => Some(crate::icons::common::icon_registry_elements::GLOBE_ELEMENTS),
        IconType::GlobeLock => {
            Some(crate::icons::common::icon_registry_elements::GLOBELOCK_ELEMENTS)
        }
        IconType::Goal => Some(crate::icons::common::icon_registry_elements::GOAL_ELEMENTS),
        IconType::Gpu => Some(crate::icons::common::icon_registry_elements::GPU_ELEMENTS),
        IconType::Grab => Some(crate::icons::common::icon_registry_elements::GRAB_ELEMENTS),
        IconType::GraduationCap => {
            Some(crate::icons::common::icon_registry_elements::GRADUATIONCAP_ELEMENTS)
        }
        IconType::Grape => Some(crate::icons::common::icon_registry_elements::GRAPE_ELEMENTS),
        IconType::Grid2X2 => Some(crate::icons::common::icon_registry_elements::GRID2X2_ELEMENTS),
        IconType::Grid2X2Check => {
            Some(crate::icons::common::icon_registry_elements::GRID2X2CHECK_ELEMENTS)
        }
        IconType::Grid2X2Plus => {
            Some(crate::icons::common::icon_registry_elements::GRID2X2PLUS_ELEMENTS)
        }
        IconType::Grid2X2X => Some(crate::icons::common::icon_registry_elements::GRID2X2X_ELEMENTS),
        IconType::Grid3X2 => Some(crate::icons::common::icon_registry_elements::GRID3X2_ELEMENTS),
        IconType::Grid3X3 => Some(crate::icons::common::icon_registry_elements::GRID3X3_ELEMENTS),
        IconType::Grip => Some(crate::icons::common::icon_registry_elements::GRIP_ELEMENTS),
        IconType::GripHorizontal => {
            Some(crate::icons::common::icon_registry_elements::GRIPHORIZONTAL_ELEMENTS)
        }
        IconType::GripVertical => {
            Some(crate::icons::common::icon_registry_elements::GRIPVERTICAL_ELEMENTS)
        }
        IconType::Group => Some(crate::icons::common::icon_registry_elements::GROUP_ELEMENTS),
        IconType::Guitar => Some(crate::icons::common::icon_registry_elements::GUITAR_ELEMENTS),
        IconType::Ham => Some(crate::icons::common::icon_registry_elements::HAM_ELEMENTS),
        IconType::Hamburger => {
            Some(crate::icons::common::icon_registry_elements::HAMBURGER_ELEMENTS)
        }
        IconType::Hammer => Some(crate::icons::common::icon_registry_elements::HAMMER_ELEMENTS),
        IconType::Hand => Some(crate::icons::common::icon_registry_elements::HAND_ELEMENTS),
        IconType::HandCoins => {
            Some(crate::icons::common::icon_registry_elements::HANDCOINS_ELEMENTS)
        }
        IconType::HandHeart => {
            Some(crate::icons::common::icon_registry_elements::HANDHEART_ELEMENTS)
        }
        IconType::HandHelping => {
            Some(crate::icons::common::icon_registry_elements::HANDHELPING_ELEMENTS)
        }
        IconType::HandMetal => {
            Some(crate::icons::common::icon_registry_elements::HANDMETAL_ELEMENTS)
        }
        IconType::HandPlatter => {
            Some(crate::icons::common::icon_registry_elements::HANDPLATTER_ELEMENTS)
        }
        IconType::Handbag => Some(crate::icons::common::icon_registry_elements::HANDBAG_ELEMENTS),
        IconType::Handshake => {
            Some(crate::icons::common::icon_registry_elements::HANDSHAKE_ELEMENTS)
        }
        IconType::HardDrive => {
            Some(crate::icons::common::icon_registry_elements::HARDDRIVE_ELEMENTS)
        }
        IconType::HardDriveDownload => {
            Some(crate::icons::common::icon_registry_elements::HARDDRIVEDOWNLOAD_ELEMENTS)
        }
        IconType::HardDriveUpload => {
            Some(crate::icons::common::icon_registry_elements::HARDDRIVEUPLOAD_ELEMENTS)
        }
        IconType::HardHat => Some(crate::icons::common::icon_registry_elements::HARDHAT_ELEMENTS),
        IconType::Hash => Some(crate::icons::common::icon_registry_elements::HASH_ELEMENTS),
        IconType::HatGlasses => {
            Some(crate::icons::common::icon_registry_elements::HATGLASSES_ELEMENTS)
        }
        IconType::Haze => Some(crate::icons::common::icon_registry_elements::HAZE_ELEMENTS),
        IconType::HdmiPort => Some(crate::icons::common::icon_registry_elements::HDMIPORT_ELEMENTS),
        IconType::Heading => Some(crate::icons::common::icon_registry_elements::HEADING_ELEMENTS),
        IconType::Heading1 => Some(crate::icons::common::icon_registry_elements::HEADING1_ELEMENTS),
        IconType::Heading2 => Some(crate::icons::common::icon_registry_elements::HEADING2_ELEMENTS),
        IconType::Heading3 => Some(crate::icons::common::icon_registry_elements::HEADING3_ELEMENTS),
        IconType::Heading4 => Some(crate::icons::common::icon_registry_elements::HEADING4_ELEMENTS),
        IconType::Heading5 => Some(crate::icons::common::icon_registry_elements::HEADING5_ELEMENTS),
        IconType::Heading6 => Some(crate::icons::common::icon_registry_elements::HEADING6_ELEMENTS),
        IconType::HeadphoneOff => {
            Some(crate::icons::common::icon_registry_elements::HEADPHONEOFF_ELEMENTS)
        }
        IconType::Headphones => {
            Some(crate::icons::common::icon_registry_elements::HEADPHONES_ELEMENTS)
        }
        IconType::Headset => Some(crate::icons::common::icon_registry_elements::HEADSET_ELEMENTS),
        IconType::Heart => Some(crate::icons::common::icon_registry_elements::HEART_ELEMENTS),
        IconType::HeartCrack => {
            Some(crate::icons::common::icon_registry_elements::HEARTCRACK_ELEMENTS)
        }
        IconType::HeartHandshake => {
            Some(crate::icons::common::icon_registry_elements::HEARTHANDSHAKE_ELEMENTS)
        }
        IconType::HeartMinus => {
            Some(crate::icons::common::icon_registry_elements::HEARTMINUS_ELEMENTS)
        }
        IconType::HeartOff => Some(crate::icons::common::icon_registry_elements::HEARTOFF_ELEMENTS),
        IconType::HeartPlus => {
            Some(crate::icons::common::icon_registry_elements::HEARTPLUS_ELEMENTS)
        }
        IconType::HeartPulse => {
            Some(crate::icons::common::icon_registry_elements::HEARTPULSE_ELEMENTS)
        }
        IconType::Heater => Some(crate::icons::common::icon_registry_elements::HEATER_ELEMENTS),
        IconType::Hexagon => Some(crate::icons::common::icon_registry_elements::HEXAGON_ELEMENTS),
        IconType::Highlighter => {
            Some(crate::icons::common::icon_registry_elements::HIGHLIGHTER_ELEMENTS)
        }
        IconType::History => Some(crate::icons::common::icon_registry_elements::HISTORY_ELEMENTS),
        IconType::Hop => Some(crate::icons::common::icon_registry_elements::HOP_ELEMENTS),
        IconType::HopOff => Some(crate::icons::common::icon_registry_elements::HOPOFF_ELEMENTS),
        IconType::Hospital => Some(crate::icons::common::icon_registry_elements::HOSPITAL_ELEMENTS),
        IconType::Hotel => Some(crate::icons::common::icon_registry_elements::HOTEL_ELEMENTS),
        IconType::Hourglass => {
            Some(crate::icons::common::icon_registry_elements::HOURGLASS_ELEMENTS)
        }
        IconType::House => Some(crate::icons::common::icon_registry_elements::HOUSE_ELEMENTS),
        IconType::HousePlug => {
            Some(crate::icons::common::icon_registry_elements::HOUSEPLUG_ELEMENTS)
        }
        IconType::HousePlus => {
            Some(crate::icons::common::icon_registry_elements::HOUSEPLUS_ELEMENTS)
        }
        IconType::HouseWifi => {
            Some(crate::icons::common::icon_registry_elements::HOUSEWIFI_ELEMENTS)
        }
        IconType::IceCreamBowl => {
            Some(crate::icons::common::icon_registry_elements::ICECREAMBOWL_ELEMENTS)
        }
        IconType::IceCreamCone => {
            Some(crate::icons::common::icon_registry_elements::ICECREAMCONE_ELEMENTS)
        }
        IconType::IdCard => Some(crate::icons::common::icon_registry_elements::IDCARD_ELEMENTS),
        IconType::IdCardLanyard => {
            Some(crate::icons::common::icon_registry_elements::IDCARDLANYARD_ELEMENTS)
        }
        IconType::Image => Some(crate::icons::common::icon_registry_elements::IMAGE_ELEMENTS),
        IconType::ImageDown => {
            Some(crate::icons::common::icon_registry_elements::IMAGEDOWN_ELEMENTS)
        }
        IconType::ImageMinus => {
            Some(crate::icons::common::icon_registry_elements::IMAGEMINUS_ELEMENTS)
        }
        IconType::ImageOff => Some(crate::icons::common::icon_registry_elements::IMAGEOFF_ELEMENTS),
        IconType::ImagePlay => {
            Some(crate::icons::common::icon_registry_elements::IMAGEPLAY_ELEMENTS)
        }
        IconType::ImagePlus => {
            Some(crate::icons::common::icon_registry_elements::IMAGEPLUS_ELEMENTS)
        }
        IconType::ImageUp => Some(crate::icons::common::icon_registry_elements::IMAGEUP_ELEMENTS),
        IconType::ImageUpscale => {
            Some(crate::icons::common::icon_registry_elements::IMAGEUPSCALE_ELEMENTS)
        }
        IconType::Images => Some(crate::icons::common::icon_registry_elements::IMAGES_ELEMENTS),
        IconType::Import => Some(crate::icons::common::icon_registry_elements::IMPORT_ELEMENTS),
        IconType::Inbox => Some(crate::icons::common::icon_registry_elements::INBOX_ELEMENTS),
        IconType::IndentDecrease => {
            Some(crate::icons::common::icon_registry_elements::INDENTDECREASE_ELEMENTS)
        }
        IconType::IndentIncrease => {
            Some(crate::icons::common::icon_registry_elements::INDENTINCREASE_ELEMENTS)
        }
        IconType::IndianRupee => {
            Some(crate::icons::common::icon_registry_elements::INDIANRUPEE_ELEMENTS)
        }
        IconType::Infinity => Some(crate::icons::common::icon_registry_elements::INFINITY_ELEMENTS),
        IconType::Info => Some(crate::icons::common::icon_registry_elements::INFO_ELEMENTS),
        IconType::InspectionPanel => {
            Some(crate::icons::common::icon_registry_elements::INSPECTIONPANEL_ELEMENTS)
        }
        IconType::Instagram => {
            Some(crate::icons::common::icon_registry_elements::INSTAGRAM_ELEMENTS)
        }
        IconType::Italic => Some(crate::icons::common::icon_registry_elements::ITALIC_ELEMENTS),
        IconType::IterationCcw => {
            Some(crate::icons::common::icon_registry_elements::ITERATIONCCW_ELEMENTS)
        }
        IconType::IterationCw => {
            Some(crate::icons::common::icon_registry_elements::ITERATIONCW_ELEMENTS)
        }
        IconType::JapaneseYen => {
            Some(crate::icons::common::icon_registry_elements::JAPANESEYEN_ELEMENTS)
        }
        IconType::Joystick => Some(crate::icons::common::icon_registry_elements::JOYSTICK_ELEMENTS),
        IconType::Kanban => Some(crate::icons::common::icon_registry_elements::KANBAN_ELEMENTS),
        IconType::Key => Some(crate::icons::common::icon_registry_elements::KEY_ELEMENTS),
        IconType::KeyRound => Some(crate::icons::common::icon_registry_elements::KEYROUND_ELEMENTS),
        IconType::KeySquare => {
            Some(crate::icons::common::icon_registry_elements::KEYSQUARE_ELEMENTS)
        }
        IconType::Keyboard => Some(crate::icons::common::icon_registry_elements::KEYBOARD_ELEMENTS),
        IconType::KeyboardMusic => {
            Some(crate::icons::common::icon_registry_elements::KEYBOARDMUSIC_ELEMENTS)
        }
        IconType::KeyboardOff => {
            Some(crate::icons::common::icon_registry_elements::KEYBOARDOFF_ELEMENTS)
        }
        IconType::Lamp => Some(crate::icons::common::icon_registry_elements::LAMP_ELEMENTS),
        IconType::LampCeiling => {
            Some(crate::icons::common::icon_registry_elements::LAMPCEILING_ELEMENTS)
        }
        IconType::LampDesk => Some(crate::icons::common::icon_registry_elements::LAMPDESK_ELEMENTS),
        IconType::LampFloor => {
            Some(crate::icons::common::icon_registry_elements::LAMPFLOOR_ELEMENTS)
        }
        IconType::LampWallDown => {
            Some(crate::icons::common::icon_registry_elements::LAMPWALLDOWN_ELEMENTS)
        }
        IconType::LampWallUp => {
            Some(crate::icons::common::icon_registry_elements::LAMPWALLUP_ELEMENTS)
        }
        IconType::LandPlot => Some(crate::icons::common::icon_registry_elements::LANDPLOT_ELEMENTS),
        IconType::Landmark => Some(crate::icons::common::icon_registry_elements::LANDMARK_ELEMENTS),
        IconType::Languages => {
            Some(crate::icons::common::icon_registry_elements::LANGUAGES_ELEMENTS)
        }
        IconType::Laptop => Some(crate::icons::common::icon_registry_elements::LAPTOP_ELEMENTS),
        IconType::LaptopMinimal => {
            Some(crate::icons::common::icon_registry_elements::LAPTOPMINIMAL_ELEMENTS)
        }
        IconType::LaptopMinimalCheck => {
            Some(crate::icons::common::icon_registry_elements::LAPTOPMINIMALCHECK_ELEMENTS)
        }
        IconType::Lasso => Some(crate::icons::common::icon_registry_elements::LASSO_ELEMENTS),
        IconType::LassoSelect => {
            Some(crate::icons::common::icon_registry_elements::LASSOSELECT_ELEMENTS)
        }
        IconType::Laugh => Some(crate::icons::common::icon_registry_elements::LAUGH_ELEMENTS),
        IconType::Layers => Some(crate::icons::common::icon_registry_elements::LAYERS_ELEMENTS),
        IconType::Layers2 => Some(crate::icons::common::icon_registry_elements::LAYERS2_ELEMENTS),
        IconType::Layers3 => Some(crate::icons::common::icon_registry_elements::LAYERS3_ELEMENTS),
        IconType::LayoutDashboard => {
            Some(crate::icons::common::icon_registry_elements::LAYOUTDASHBOARD_ELEMENTS)
        }
        IconType::LayoutGrid => {
            Some(crate::icons::common::icon_registry_elements::LAYOUTGRID_ELEMENTS)
        }
        IconType::LayoutList => {
            Some(crate::icons::common::icon_registry_elements::LAYOUTLIST_ELEMENTS)
        }
        IconType::LayoutPanelLeft => {
            Some(crate::icons::common::icon_registry_elements::LAYOUTPANELLEFT_ELEMENTS)
        }
        IconType::LayoutPanelTop => {
            Some(crate::icons::common::icon_registry_elements::LAYOUTPANELTOP_ELEMENTS)
        }
        IconType::LayoutTemplate => {
            Some(crate::icons::common::icon_registry_elements::LAYOUTTEMPLATE_ELEMENTS)
        }
        IconType::Leaf => Some(crate::icons::common::icon_registry_elements::LEAF_ELEMENTS),
        IconType::LeafyGreen => {
            Some(crate::icons::common::icon_registry_elements::LEAFYGREEN_ELEMENTS)
        }
        IconType::Lectern => Some(crate::icons::common::icon_registry_elements::LECTERN_ELEMENTS),
        IconType::LetterText => {
            Some(crate::icons::common::icon_registry_elements::LETTERTEXT_ELEMENTS)
        }
        IconType::Library => Some(crate::icons::common::icon_registry_elements::LIBRARY_ELEMENTS),
        IconType::LibraryBig => {
            Some(crate::icons::common::icon_registry_elements::LIBRARYBIG_ELEMENTS)
        }
        IconType::LifeBuoy => Some(crate::icons::common::icon_registry_elements::LIFEBUOY_ELEMENTS),
        IconType::Ligature => Some(crate::icons::common::icon_registry_elements::LIGATURE_ELEMENTS),
        IconType::Lightbulb => {
            Some(crate::icons::common::icon_registry_elements::LIGHTBULB_ELEMENTS)
        }
        IconType::LightbulbOff => {
            Some(crate::icons::common::icon_registry_elements::LIGHTBULBOFF_ELEMENTS)
        }
        IconType::LineSquiggle => {
            Some(crate::icons::common::icon_registry_elements::LINESQUIGGLE_ELEMENTS)
        }
        IconType::Link => Some(crate::icons::common::icon_registry_elements::LINK_ELEMENTS),
        IconType::Link2 => Some(crate::icons::common::icon_registry_elements::LINK2_ELEMENTS),
        IconType::Link2Off => Some(crate::icons::common::icon_registry_elements::LINK2OFF_ELEMENTS),
        IconType::Linkedin => Some(crate::icons::common::icon_registry_elements::LINKEDIN_ELEMENTS),
        IconType::List => Some(crate::icons::common::icon_registry_elements::LIST_ELEMENTS),
        IconType::ListCheck => {
            Some(crate::icons::common::icon_registry_elements::LISTCHECK_ELEMENTS)
        }
        IconType::ListChecks => {
            Some(crate::icons::common::icon_registry_elements::LISTCHECKS_ELEMENTS)
        }
        IconType::ListCollapse => {
            Some(crate::icons::common::icon_registry_elements::LISTCOLLAPSE_ELEMENTS)
        }
        IconType::ListEnd => Some(crate::icons::common::icon_registry_elements::LISTEND_ELEMENTS),
        IconType::ListFilter => {
            Some(crate::icons::common::icon_registry_elements::LISTFILTER_ELEMENTS)
        }
        IconType::ListFilterPlus => {
            Some(crate::icons::common::icon_registry_elements::LISTFILTERPLUS_ELEMENTS)
        }
        IconType::ListMinus => {
            Some(crate::icons::common::icon_registry_elements::LISTMINUS_ELEMENTS)
        }
        IconType::ListMusic => {
            Some(crate::icons::common::icon_registry_elements::LISTMUSIC_ELEMENTS)
        }
        IconType::ListOrdered => {
            Some(crate::icons::common::icon_registry_elements::LISTORDERED_ELEMENTS)
        }
        IconType::ListPlus => Some(crate::icons::common::icon_registry_elements::LISTPLUS_ELEMENTS),
        IconType::ListRestart => {
            Some(crate::icons::common::icon_registry_elements::LISTRESTART_ELEMENTS)
        }
        IconType::ListStart => {
            Some(crate::icons::common::icon_registry_elements::LISTSTART_ELEMENTS)
        }
        IconType::ListTodo => Some(crate::icons::common::icon_registry_elements::LISTTODO_ELEMENTS),
        IconType::ListTree => Some(crate::icons::common::icon_registry_elements::LISTTREE_ELEMENTS),
        IconType::ListVideo => {
            Some(crate::icons::common::icon_registry_elements::LISTVIDEO_ELEMENTS)
        }
        IconType::ListX => Some(crate::icons::common::icon_registry_elements::LISTX_ELEMENTS),
        IconType::Loader => Some(crate::icons::common::icon_registry_elements::LOADER_ELEMENTS),
        IconType::LoaderCircle => {
            Some(crate::icons::common::icon_registry_elements::LOADERCIRCLE_ELEMENTS)
        }
        IconType::LoaderPinwheel => {
            Some(crate::icons::common::icon_registry_elements::LOADERPINWHEEL_ELEMENTS)
        }
        IconType::Locate => Some(crate::icons::common::icon_registry_elements::LOCATE_ELEMENTS),
        IconType::LocateFixed => {
            Some(crate::icons::common::icon_registry_elements::LOCATEFIXED_ELEMENTS)
        }
        IconType::LocateOff => {
            Some(crate::icons::common::icon_registry_elements::LOCATEOFF_ELEMENTS)
        }
        IconType::LocationEdit => {
            Some(crate::icons::common::icon_registry_elements::LOCATIONEDIT_ELEMENTS)
        }
        IconType::Lock => Some(crate::icons::common::icon_registry_elements::LOCK_ELEMENTS),
        IconType::LockKeyhole => {
            Some(crate::icons::common::icon_registry_elements::LOCKKEYHOLE_ELEMENTS)
        }
        IconType::LockKeyholeOpen => {
            Some(crate::icons::common::icon_registry_elements::LOCKKEYHOLEOPEN_ELEMENTS)
        }
        IconType::LockOpen => Some(crate::icons::common::icon_registry_elements::LOCKOPEN_ELEMENTS),
        IconType::LogIn => Some(crate::icons::common::icon_registry_elements::LOGIN_ELEMENTS),
        IconType::LogOut => Some(crate::icons::common::icon_registry_elements::LOGOUT_ELEMENTS),
        IconType::Logs => Some(crate::icons::common::icon_registry_elements::LOGS_ELEMENTS),
        IconType::Lollipop => Some(crate::icons::common::icon_registry_elements::LOLLIPOP_ELEMENTS),
        IconType::Luggage => Some(crate::icons::common::icon_registry_elements::LUGGAGE_ELEMENTS),
        IconType::Magnet => Some(crate::icons::common::icon_registry_elements::MAGNET_ELEMENTS),
        IconType::Mail => Some(crate::icons::common::icon_registry_elements::MAIL_ELEMENTS),
        IconType::MailCheck => {
            Some(crate::icons::common::icon_registry_elements::MAILCHECK_ELEMENTS)
        }
        IconType::MailMinus => {
            Some(crate::icons::common::icon_registry_elements::MAILMINUS_ELEMENTS)
        }
        IconType::MailOpen => Some(crate::icons::common::icon_registry_elements::MAILOPEN_ELEMENTS),
        IconType::MailPlus => Some(crate::icons::common::icon_registry_elements::MAILPLUS_ELEMENTS),
        IconType::MailQuestion => {
            Some(crate::icons::common::icon_registry_elements::MAILQUESTION_ELEMENTS)
        }
        IconType::MailQuestionMark => {
            Some(crate::icons::common::icon_registry_elements::MAILQUESTIONMARK_ELEMENTS)
        }
        IconType::MailSearch => {
            Some(crate::icons::common::icon_registry_elements::MAILSEARCH_ELEMENTS)
        }
        IconType::MailWarning => {
            Some(crate::icons::common::icon_registry_elements::MAILWARNING_ELEMENTS)
        }
        IconType::MailX => Some(crate::icons::common::icon_registry_elements::MAILX_ELEMENTS),
        IconType::Mailbox => Some(crate::icons::common::icon_registry_elements::MAILBOX_ELEMENTS),
        IconType::Mails => Some(crate::icons::common::icon_registry_elements::MAILS_ELEMENTS),
        IconType::Map => Some(crate::icons::common::icon_registry_elements::MAP_ELEMENTS),
        IconType::MapMinus => Some(crate::icons::common::icon_registry_elements::MAPMINUS_ELEMENTS),
        IconType::MapPin => Some(crate::icons::common::icon_registry_elements::MAPPIN_ELEMENTS),
        IconType::MapPinCheck => {
            Some(crate::icons::common::icon_registry_elements::MAPPINCHECK_ELEMENTS)
        }
        IconType::MapPinCheckInside => {
            Some(crate::icons::common::icon_registry_elements::MAPPINCHECKINSIDE_ELEMENTS)
        }
        IconType::MapPinHouse => {
            Some(crate::icons::common::icon_registry_elements::MAPPINHOUSE_ELEMENTS)
        }
        IconType::MapPinMinus => {
            Some(crate::icons::common::icon_registry_elements::MAPPINMINUS_ELEMENTS)
        }
        IconType::MapPinMinusInside => {
            Some(crate::icons::common::icon_registry_elements::MAPPINMINUSINSIDE_ELEMENTS)
        }
        IconType::MapPinOff => {
            Some(crate::icons::common::icon_registry_elements::MAPPINOFF_ELEMENTS)
        }
        IconType::MapPinPen => {
            Some(crate::icons::common::icon_registry_elements::MAPPINPEN_ELEMENTS)
        }
        IconType::MapPinPlus => {
            Some(crate::icons::common::icon_registry_elements::MAPPINPLUS_ELEMENTS)
        }
        IconType::MapPinPlusInside => {
            Some(crate::icons::common::icon_registry_elements::MAPPINPLUSINSIDE_ELEMENTS)
        }
        IconType::MapPinX => Some(crate::icons::common::icon_registry_elements::MAPPINX_ELEMENTS),
        IconType::MapPinXInside => {
            Some(crate::icons::common::icon_registry_elements::MAPPINXINSIDE_ELEMENTS)
        }
        IconType::MapPinned => {
            Some(crate::icons::common::icon_registry_elements::MAPPINNED_ELEMENTS)
        }
        IconType::MapPlus => Some(crate::icons::common::icon_registry_elements::MAPPLUS_ELEMENTS),
        IconType::Mars => Some(crate::icons::common::icon_registry_elements::MARS_ELEMENTS),
        IconType::MarsStroke => {
            Some(crate::icons::common::icon_registry_elements::MARSSTROKE_ELEMENTS)
        }
        IconType::Martini => Some(crate::icons::common::icon_registry_elements::MARTINI_ELEMENTS),
        IconType::Maximize => Some(crate::icons::common::icon_registry_elements::MAXIMIZE_ELEMENTS),
        IconType::Maximize2 => {
            Some(crate::icons::common::icon_registry_elements::MAXIMIZE2_ELEMENTS)
        }
        IconType::Medal => Some(crate::icons::common::icon_registry_elements::MEDAL_ELEMENTS),
        IconType::Megaphone => {
            Some(crate::icons::common::icon_registry_elements::MEGAPHONE_ELEMENTS)
        }
        IconType::MegaphoneOff => {
            Some(crate::icons::common::icon_registry_elements::MEGAPHONEOFF_ELEMENTS)
        }
        IconType::Meh => Some(crate::icons::common::icon_registry_elements::MEH_ELEMENTS),
        IconType::MemoryStick => {
            Some(crate::icons::common::icon_registry_elements::MEMORYSTICK_ELEMENTS)
        }
        IconType::Menu => Some(crate::icons::common::icon_registry_elements::MENU_ELEMENTS),
        IconType::Merge => Some(crate::icons::common::icon_registry_elements::MERGE_ELEMENTS),
        IconType::MessageCircle => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLE_ELEMENTS)
        }
        IconType::MessageCircleCode => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLECODE_ELEMENTS)
        }
        IconType::MessageCircleDashed => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEDASHED_ELEMENTS)
        }
        IconType::MessageCircleHeart => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEHEART_ELEMENTS)
        }
        IconType::MessageCircleMore => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEMORE_ELEMENTS)
        }
        IconType::MessageCircleOff => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEOFF_ELEMENTS)
        }
        IconType::MessageCirclePlus => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEPLUS_ELEMENTS)
        }
        IconType::MessageCircleQuestion => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEQUESTION_ELEMENTS)
        }
        IconType::MessageCircleQuestionMark => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEQUESTIONMARK_ELEMENTS)
        }
        IconType::MessageCircleReply => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEREPLY_ELEMENTS)
        }
        IconType::MessageCircleWarning => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEWARNING_ELEMENTS)
        }
        IconType::MessageCircleX => {
            Some(crate::icons::common::icon_registry_elements::MESSAGECIRCLEX_ELEMENTS)
        }
        IconType::MessageSquare => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUARE_ELEMENTS)
        }
        IconType::MessageSquareCode => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUARECODE_ELEMENTS)
        }
        IconType::MessageSquareDashed => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREDASHED_ELEMENTS)
        }
        IconType::MessageSquareDiff => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREDIFF_ELEMENTS)
        }
        IconType::MessageSquareDot => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREDOT_ELEMENTS)
        }
        IconType::MessageSquareHeart => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREHEART_ELEMENTS)
        }
        IconType::MessageSquareLock => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUARELOCK_ELEMENTS)
        }
        IconType::MessageSquareMore => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREMORE_ELEMENTS)
        }
        IconType::MessageSquareOff => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREOFF_ELEMENTS)
        }
        IconType::MessageSquarePlus => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREPLUS_ELEMENTS)
        }
        IconType::MessageSquareQuote => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREQUOTE_ELEMENTS)
        }
        IconType::MessageSquareReply => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREREPLY_ELEMENTS)
        }
        IconType::MessageSquareShare => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUARESHARE_ELEMENTS)
        }
        IconType::MessageSquareText => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUARETEXT_ELEMENTS)
        }
        IconType::MessageSquareWarning => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREWARNING_ELEMENTS)
        }
        IconType::MessageSquareX => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESQUAREX_ELEMENTS)
        }
        IconType::MessagesSquare => {
            Some(crate::icons::common::icon_registry_elements::MESSAGESSQUARE_ELEMENTS)
        }
        IconType::Mic => Some(crate::icons::common::icon_registry_elements::MIC_ELEMENTS),
        IconType::MicOff => Some(crate::icons::common::icon_registry_elements::MICOFF_ELEMENTS),
        IconType::MicVocal => Some(crate::icons::common::icon_registry_elements::MICVOCAL_ELEMENTS),
        IconType::Microchip => {
            Some(crate::icons::common::icon_registry_elements::MICROCHIP_ELEMENTS)
        }
        IconType::Microscope => {
            Some(crate::icons::common::icon_registry_elements::MICROSCOPE_ELEMENTS)
        }
        IconType::Microwave => {
            Some(crate::icons::common::icon_registry_elements::MICROWAVE_ELEMENTS)
        }
        IconType::Milestone => {
            Some(crate::icons::common::icon_registry_elements::MILESTONE_ELEMENTS)
        }
        IconType::Milk => Some(crate::icons::common::icon_registry_elements::MILK_ELEMENTS),
        IconType::MilkOff => Some(crate::icons::common::icon_registry_elements::MILKOFF_ELEMENTS),
        IconType::Minimize => Some(crate::icons::common::icon_registry_elements::MINIMIZE_ELEMENTS),
        IconType::Minimize2 => {
            Some(crate::icons::common::icon_registry_elements::MINIMIZE2_ELEMENTS)
        }
        IconType::Minus => Some(crate::icons::common::icon_registry_elements::MINUS_ELEMENTS),
        IconType::Monitor => Some(crate::icons::common::icon_registry_elements::MONITOR_ELEMENTS),
        IconType::MonitorCheck => {
            Some(crate::icons::common::icon_registry_elements::MONITORCHECK_ELEMENTS)
        }
        IconType::MonitorCog => {
            Some(crate::icons::common::icon_registry_elements::MONITORCOG_ELEMENTS)
        }
        IconType::MonitorDot => {
            Some(crate::icons::common::icon_registry_elements::MONITORDOT_ELEMENTS)
        }
        IconType::MonitorDown => {
            Some(crate::icons::common::icon_registry_elements::MONITORDOWN_ELEMENTS)
        }
        IconType::MonitorOff => {
            Some(crate::icons::common::icon_registry_elements::MONITOROFF_ELEMENTS)
        }
        IconType::MonitorPause => {
            Some(crate::icons::common::icon_registry_elements::MONITORPAUSE_ELEMENTS)
        }
        IconType::MonitorPlay => {
            Some(crate::icons::common::icon_registry_elements::MONITORPLAY_ELEMENTS)
        }
        IconType::MonitorSmartphone => {
            Some(crate::icons::common::icon_registry_elements::MONITORSMARTPHONE_ELEMENTS)
        }
        IconType::MonitorSpeaker => {
            Some(crate::icons::common::icon_registry_elements::MONITORSPEAKER_ELEMENTS)
        }
        IconType::MonitorStop => {
            Some(crate::icons::common::icon_registry_elements::MONITORSTOP_ELEMENTS)
        }
        IconType::MonitorUp => {
            Some(crate::icons::common::icon_registry_elements::MONITORUP_ELEMENTS)
        }
        IconType::MonitorX => Some(crate::icons::common::icon_registry_elements::MONITORX_ELEMENTS),
        IconType::Moon => Some(crate::icons::common::icon_registry_elements::MOON_ELEMENTS),
        IconType::MoonStar => Some(crate::icons::common::icon_registry_elements::MOONSTAR_ELEMENTS),
        IconType::Mountain => Some(crate::icons::common::icon_registry_elements::MOUNTAIN_ELEMENTS),
        IconType::MountainSnow => {
            Some(crate::icons::common::icon_registry_elements::MOUNTAINSNOW_ELEMENTS)
        }
        IconType::Mouse => Some(crate::icons::common::icon_registry_elements::MOUSE_ELEMENTS),
        IconType::MouseOff => Some(crate::icons::common::icon_registry_elements::MOUSEOFF_ELEMENTS),
        IconType::MousePointer => {
            Some(crate::icons::common::icon_registry_elements::MOUSEPOINTER_ELEMENTS)
        }
        IconType::MousePointer2 => {
            Some(crate::icons::common::icon_registry_elements::MOUSEPOINTER2_ELEMENTS)
        }
        IconType::MousePointerBan => {
            Some(crate::icons::common::icon_registry_elements::MOUSEPOINTERBAN_ELEMENTS)
        }
        IconType::MousePointerClick => {
            Some(crate::icons::common::icon_registry_elements::MOUSEPOINTERCLICK_ELEMENTS)
        }
        IconType::Move => Some(crate::icons::common::icon_registry_elements::MOVE_ELEMENTS),
        IconType::Move3D => Some(crate::icons::common::icon_registry_elements::MOVE3D_ELEMENTS),
        IconType::MoveDiagonal => {
            Some(crate::icons::common::icon_registry_elements::MOVEDIAGONAL_ELEMENTS)
        }
        IconType::MoveDiagonal2 => {
            Some(crate::icons::common::icon_registry_elements::MOVEDIAGONAL2_ELEMENTS)
        }
        IconType::MoveDown => Some(crate::icons::common::icon_registry_elements::MOVEDOWN_ELEMENTS),
        IconType::MoveDownLeft => {
            Some(crate::icons::common::icon_registry_elements::MOVEDOWNLEFT_ELEMENTS)
        }
        IconType::MoveDownRight => {
            Some(crate::icons::common::icon_registry_elements::MOVEDOWNRIGHT_ELEMENTS)
        }
        IconType::MoveHorizontal => {
            Some(crate::icons::common::icon_registry_elements::MOVEHORIZONTAL_ELEMENTS)
        }
        IconType::MoveLeft => Some(crate::icons::common::icon_registry_elements::MOVELEFT_ELEMENTS),
        IconType::MoveRight => {
            Some(crate::icons::common::icon_registry_elements::MOVERIGHT_ELEMENTS)
        }
        IconType::MoveUp => Some(crate::icons::common::icon_registry_elements::MOVEUP_ELEMENTS),
        IconType::MoveUpLeft => {
            Some(crate::icons::common::icon_registry_elements::MOVEUPLEFT_ELEMENTS)
        }
        IconType::MoveUpRight => {
            Some(crate::icons::common::icon_registry_elements::MOVEUPRIGHT_ELEMENTS)
        }
        IconType::MoveVertical => {
            Some(crate::icons::common::icon_registry_elements::MOVEVERTICAL_ELEMENTS)
        }
        IconType::Music => Some(crate::icons::common::icon_registry_elements::MUSIC_ELEMENTS),
        IconType::Music2 => Some(crate::icons::common::icon_registry_elements::MUSIC2_ELEMENTS),
        IconType::Music3 => Some(crate::icons::common::icon_registry_elements::MUSIC3_ELEMENTS),
        IconType::Music4 => Some(crate::icons::common::icon_registry_elements::MUSIC4_ELEMENTS),
        IconType::Navigation => {
            Some(crate::icons::common::icon_registry_elements::NAVIGATION_ELEMENTS)
        }
        IconType::Navigation2 => {
            Some(crate::icons::common::icon_registry_elements::NAVIGATION2_ELEMENTS)
        }
        IconType::Navigation2Off => {
            Some(crate::icons::common::icon_registry_elements::NAVIGATION2OFF_ELEMENTS)
        }
        IconType::NavigationOff => {
            Some(crate::icons::common::icon_registry_elements::NAVIGATIONOFF_ELEMENTS)
        }
        IconType::Network => Some(crate::icons::common::icon_registry_elements::NETWORK_ELEMENTS),
        IconType::Newspaper => {
            Some(crate::icons::common::icon_registry_elements::NEWSPAPER_ELEMENTS)
        }
        IconType::Nfc => Some(crate::icons::common::icon_registry_elements::NFC_ELEMENTS),
        IconType::NonBinary => {
            Some(crate::icons::common::icon_registry_elements::NONBINARY_ELEMENTS)
        }
        IconType::Notebook => Some(crate::icons::common::icon_registry_elements::NOTEBOOK_ELEMENTS),
        IconType::NotebookPen => {
            Some(crate::icons::common::icon_registry_elements::NOTEBOOKPEN_ELEMENTS)
        }
        IconType::NotebookTabs => {
            Some(crate::icons::common::icon_registry_elements::NOTEBOOKTABS_ELEMENTS)
        }
        IconType::NotebookText => {
            Some(crate::icons::common::icon_registry_elements::NOTEBOOKTEXT_ELEMENTS)
        }
        IconType::NotepadText => {
            Some(crate::icons::common::icon_registry_elements::NOTEPADTEXT_ELEMENTS)
        }
        IconType::NotepadTextDashed => {
            Some(crate::icons::common::icon_registry_elements::NOTEPADTEXTDASHED_ELEMENTS)
        }
        IconType::Nut => Some(crate::icons::common::icon_registry_elements::NUT_ELEMENTS),
        IconType::NutOff => Some(crate::icons::common::icon_registry_elements::NUTOFF_ELEMENTS),
        IconType::Octagon => Some(crate::icons::common::icon_registry_elements::OCTAGON_ELEMENTS),
        IconType::OctagonAlert => {
            Some(crate::icons::common::icon_registry_elements::OCTAGONALERT_ELEMENTS)
        }
        IconType::OctagonMinus => {
            Some(crate::icons::common::icon_registry_elements::OCTAGONMINUS_ELEMENTS)
        }
        IconType::OctagonPause => {
            Some(crate::icons::common::icon_registry_elements::OCTAGONPAUSE_ELEMENTS)
        }
        IconType::OctagonX => Some(crate::icons::common::icon_registry_elements::OCTAGONX_ELEMENTS),
        IconType::Omega => Some(crate::icons::common::icon_registry_elements::OMEGA_ELEMENTS),
        IconType::OptionIcon => {
            Some(crate::icons::common::icon_registry_elements::OPTIONICON_ELEMENTS)
        }
        IconType::Orbit => Some(crate::icons::common::icon_registry_elements::ORBIT_ELEMENTS),
        IconType::Origami => Some(crate::icons::common::icon_registry_elements::ORIGAMI_ELEMENTS),
        IconType::Package => Some(crate::icons::common::icon_registry_elements::PACKAGE_ELEMENTS),
        IconType::Package2 => Some(crate::icons::common::icon_registry_elements::PACKAGE2_ELEMENTS),
        IconType::PackageCheck => {
            Some(crate::icons::common::icon_registry_elements::PACKAGECHECK_ELEMENTS)
        }
        IconType::PackageMinus => {
            Some(crate::icons::common::icon_registry_elements::PACKAGEMINUS_ELEMENTS)
        }
        IconType::PackageOpen => {
            Some(crate::icons::common::icon_registry_elements::PACKAGEOPEN_ELEMENTS)
        }
        IconType::PackagePlus => {
            Some(crate::icons::common::icon_registry_elements::PACKAGEPLUS_ELEMENTS)
        }
        IconType::PackageSearch => {
            Some(crate::icons::common::icon_registry_elements::PACKAGESEARCH_ELEMENTS)
        }
        IconType::PackageX => Some(crate::icons::common::icon_registry_elements::PACKAGEX_ELEMENTS),
        IconType::PaintBucket => {
            Some(crate::icons::common::icon_registry_elements::PAINTBUCKET_ELEMENTS)
        }
        IconType::PaintRoller => {
            Some(crate::icons::common::icon_registry_elements::PAINTROLLER_ELEMENTS)
        }
        IconType::Paintbrush => {
            Some(crate::icons::common::icon_registry_elements::PAINTBRUSH_ELEMENTS)
        }
        IconType::PaintbrushVertical => {
            Some(crate::icons::common::icon_registry_elements::PAINTBRUSHVERTICAL_ELEMENTS)
        }
        IconType::Palette => Some(crate::icons::common::icon_registry_elements::PALETTE_ELEMENTS),
        IconType::Panda => Some(crate::icons::common::icon_registry_elements::PANDA_ELEMENTS),
        IconType::PanelBottom => {
            Some(crate::icons::common::icon_registry_elements::PANELBOTTOM_ELEMENTS)
        }
        IconType::PanelBottomClose => {
            Some(crate::icons::common::icon_registry_elements::PANELBOTTOMCLOSE_ELEMENTS)
        }
        IconType::PanelBottomDashed => {
            Some(crate::icons::common::icon_registry_elements::PANELBOTTOMDASHED_ELEMENTS)
        }
        IconType::PanelBottomOpen => {
            Some(crate::icons::common::icon_registry_elements::PANELBOTTOMOPEN_ELEMENTS)
        }
        IconType::PanelLeft => {
            Some(crate::icons::common::icon_registry_elements::PANELLEFT_ELEMENTS)
        }
        IconType::PanelLeftClose => {
            Some(crate::icons::common::icon_registry_elements::PANELLEFTCLOSE_ELEMENTS)
        }
        IconType::PanelLeftDashed => {
            Some(crate::icons::common::icon_registry_elements::PANELLEFTDASHED_ELEMENTS)
        }
        IconType::PanelLeftOpen => {
            Some(crate::icons::common::icon_registry_elements::PANELLEFTOPEN_ELEMENTS)
        }
        IconType::PanelRight => {
            Some(crate::icons::common::icon_registry_elements::PANELRIGHT_ELEMENTS)
        }
        IconType::PanelRightClose => {
            Some(crate::icons::common::icon_registry_elements::PANELRIGHTCLOSE_ELEMENTS)
        }
        IconType::PanelRightDashed => {
            Some(crate::icons::common::icon_registry_elements::PANELRIGHTDASHED_ELEMENTS)
        }
        IconType::PanelRightOpen => {
            Some(crate::icons::common::icon_registry_elements::PANELRIGHTOPEN_ELEMENTS)
        }
        IconType::PanelTop => Some(crate::icons::common::icon_registry_elements::PANELTOP_ELEMENTS),
        IconType::PanelTopClose => {
            Some(crate::icons::common::icon_registry_elements::PANELTOPCLOSE_ELEMENTS)
        }
        IconType::PanelTopDashed => {
            Some(crate::icons::common::icon_registry_elements::PANELTOPDASHED_ELEMENTS)
        }
        IconType::PanelTopOpen => {
            Some(crate::icons::common::icon_registry_elements::PANELTOPOPEN_ELEMENTS)
        }
        IconType::PanelsLeftBottom => {
            Some(crate::icons::common::icon_registry_elements::PANELSLEFTBOTTOM_ELEMENTS)
        }
        IconType::PanelsRightBottom => {
            Some(crate::icons::common::icon_registry_elements::PANELSRIGHTBOTTOM_ELEMENTS)
        }
        IconType::PanelsTopLeft => {
            Some(crate::icons::common::icon_registry_elements::PANELSTOPLEFT_ELEMENTS)
        }
        IconType::Paperclip => {
            Some(crate::icons::common::icon_registry_elements::PAPERCLIP_ELEMENTS)
        }
        IconType::Parentheses => {
            Some(crate::icons::common::icon_registry_elements::PARENTHESES_ELEMENTS)
        }
        IconType::ParkingMeter => {
            Some(crate::icons::common::icon_registry_elements::PARKINGMETER_ELEMENTS)
        }
        IconType::PartyPopper => {
            Some(crate::icons::common::icon_registry_elements::PARTYPOPPER_ELEMENTS)
        }
        IconType::Pause => Some(crate::icons::common::icon_registry_elements::PAUSE_ELEMENTS),
        IconType::PawPrint => Some(crate::icons::common::icon_registry_elements::PAWPRINT_ELEMENTS),
        IconType::PcCase => Some(crate::icons::common::icon_registry_elements::PCCASE_ELEMENTS),
        IconType::Pen => Some(crate::icons::common::icon_registry_elements::PEN_ELEMENTS),
        IconType::PenLine => Some(crate::icons::common::icon_registry_elements::PENLINE_ELEMENTS),
        IconType::PenOff => Some(crate::icons::common::icon_registry_elements::PENOFF_ELEMENTS),
        IconType::PenTool => Some(crate::icons::common::icon_registry_elements::PENTOOL_ELEMENTS),
        IconType::Pencil => Some(crate::icons::common::icon_registry_elements::PENCIL_ELEMENTS),
        IconType::PencilLine => {
            Some(crate::icons::common::icon_registry_elements::PENCILLINE_ELEMENTS)
        }
        IconType::PencilOff => {
            Some(crate::icons::common::icon_registry_elements::PENCILOFF_ELEMENTS)
        }
        IconType::PencilRuler => {
            Some(crate::icons::common::icon_registry_elements::PENCILRULER_ELEMENTS)
        }
        IconType::Pentagon => Some(crate::icons::common::icon_registry_elements::PENTAGON_ELEMENTS),
        IconType::Percent => Some(crate::icons::common::icon_registry_elements::PERCENT_ELEMENTS),
        IconType::PersonStanding => {
            Some(crate::icons::common::icon_registry_elements::PERSONSTANDING_ELEMENTS)
        }
        IconType::PhilippinePeso => {
            Some(crate::icons::common::icon_registry_elements::PHILIPPINEPESO_ELEMENTS)
        }
        IconType::Phone => Some(crate::icons::common::icon_registry_elements::PHONE_ELEMENTS),
        IconType::PhoneCall => {
            Some(crate::icons::common::icon_registry_elements::PHONECALL_ELEMENTS)
        }
        IconType::PhoneForwarded => {
            Some(crate::icons::common::icon_registry_elements::PHONEFORWARDED_ELEMENTS)
        }
        IconType::PhoneIncoming => {
            Some(crate::icons::common::icon_registry_elements::PHONEINCOMING_ELEMENTS)
        }
        IconType::PhoneMissed => {
            Some(crate::icons::common::icon_registry_elements::PHONEMISSED_ELEMENTS)
        }
        IconType::PhoneOff => Some(crate::icons::common::icon_registry_elements::PHONEOFF_ELEMENTS),
        IconType::PhoneOutgoing => {
            Some(crate::icons::common::icon_registry_elements::PHONEOUTGOING_ELEMENTS)
        }
        IconType::Pi => Some(crate::icons::common::icon_registry_elements::PI_ELEMENTS),
        IconType::Piano => Some(crate::icons::common::icon_registry_elements::PIANO_ELEMENTS),
        IconType::Pickaxe => Some(crate::icons::common::icon_registry_elements::PICKAXE_ELEMENTS),
        IconType::PictureInPicture => {
            Some(crate::icons::common::icon_registry_elements::PICTUREINPICTURE_ELEMENTS)
        }
        IconType::PictureInPicture2 => {
            Some(crate::icons::common::icon_registry_elements::PICTUREINPICTURE2_ELEMENTS)
        }
        IconType::PiggyBank => {
            Some(crate::icons::common::icon_registry_elements::PIGGYBANK_ELEMENTS)
        }
        IconType::Pilcrow => Some(crate::icons::common::icon_registry_elements::PILCROW_ELEMENTS),
        IconType::PilcrowLeft => {
            Some(crate::icons::common::icon_registry_elements::PILCROWLEFT_ELEMENTS)
        }
        IconType::PilcrowRight => {
            Some(crate::icons::common::icon_registry_elements::PILCROWRIGHT_ELEMENTS)
        }
        IconType::Pill => Some(crate::icons::common::icon_registry_elements::PILL_ELEMENTS),
        IconType::PillBottle => {
            Some(crate::icons::common::icon_registry_elements::PILLBOTTLE_ELEMENTS)
        }
        IconType::Pin => Some(crate::icons::common::icon_registry_elements::PIN_ELEMENTS),
        IconType::PinOff => Some(crate::icons::common::icon_registry_elements::PINOFF_ELEMENTS),
        IconType::Pipette => Some(crate::icons::common::icon_registry_elements::PIPETTE_ELEMENTS),
        IconType::Pizza => Some(crate::icons::common::icon_registry_elements::PIZZA_ELEMENTS),
        IconType::Plane => Some(crate::icons::common::icon_registry_elements::PLANE_ELEMENTS),
        IconType::PlaneLanding => {
            Some(crate::icons::common::icon_registry_elements::PLANELANDING_ELEMENTS)
        }
        IconType::PlaneTakeoff => {
            Some(crate::icons::common::icon_registry_elements::PLANETAKEOFF_ELEMENTS)
        }
        IconType::Play => Some(crate::icons::common::icon_registry_elements::PLAY_ELEMENTS),
        IconType::Plug => Some(crate::icons::common::icon_registry_elements::PLUG_ELEMENTS),
        IconType::Plug2 => Some(crate::icons::common::icon_registry_elements::PLUG2_ELEMENTS),
        IconType::PlugZap => Some(crate::icons::common::icon_registry_elements::PLUGZAP_ELEMENTS),
        IconType::Plus => Some(crate::icons::common::icon_registry_elements::PLUS_ELEMENTS),
        IconType::Pocket => Some(crate::icons::common::icon_registry_elements::POCKET_ELEMENTS),
        IconType::PocketKnife => {
            Some(crate::icons::common::icon_registry_elements::POCKETKNIFE_ELEMENTS)
        }
        IconType::Podcast => Some(crate::icons::common::icon_registry_elements::PODCAST_ELEMENTS),
        IconType::Pointer => Some(crate::icons::common::icon_registry_elements::POINTER_ELEMENTS),
        IconType::PointerOff => {
            Some(crate::icons::common::icon_registry_elements::POINTEROFF_ELEMENTS)
        }
        IconType::Popcorn => Some(crate::icons::common::icon_registry_elements::POPCORN_ELEMENTS),
        IconType::Popsicle => Some(crate::icons::common::icon_registry_elements::POPSICLE_ELEMENTS),
        IconType::PoundSterling => {
            Some(crate::icons::common::icon_registry_elements::POUNDSTERLING_ELEMENTS)
        }
        IconType::Power => Some(crate::icons::common::icon_registry_elements::POWER_ELEMENTS),
        IconType::PowerOff => Some(crate::icons::common::icon_registry_elements::POWEROFF_ELEMENTS),
        IconType::Presentation => {
            Some(crate::icons::common::icon_registry_elements::PRESENTATION_ELEMENTS)
        }
        IconType::Printer => Some(crate::icons::common::icon_registry_elements::PRINTER_ELEMENTS),
        IconType::PrinterCheck => {
            Some(crate::icons::common::icon_registry_elements::PRINTERCHECK_ELEMENTS)
        }
        IconType::Projector => {
            Some(crate::icons::common::icon_registry_elements::PROJECTOR_ELEMENTS)
        }
        IconType::Proportions => {
            Some(crate::icons::common::icon_registry_elements::PROPORTIONS_ELEMENTS)
        }
        IconType::Puzzle => Some(crate::icons::common::icon_registry_elements::PUZZLE_ELEMENTS),
        IconType::Pyramid => Some(crate::icons::common::icon_registry_elements::PYRAMID_ELEMENTS),
        IconType::QrCode => Some(crate::icons::common::icon_registry_elements::QRCODE_ELEMENTS),
        IconType::Quote => Some(crate::icons::common::icon_registry_elements::QUOTE_ELEMENTS),
        IconType::Rabbit => Some(crate::icons::common::icon_registry_elements::RABBIT_ELEMENTS),
        IconType::Radar => Some(crate::icons::common::icon_registry_elements::RADAR_ELEMENTS),
        IconType::Radiation => {
            Some(crate::icons::common::icon_registry_elements::RADIATION_ELEMENTS)
        }
        IconType::Radical => Some(crate::icons::common::icon_registry_elements::RADICAL_ELEMENTS),
        IconType::Radio => Some(crate::icons::common::icon_registry_elements::RADIO_ELEMENTS),
        IconType::RadioReceiver => {
            Some(crate::icons::common::icon_registry_elements::RADIORECEIVER_ELEMENTS)
        }
        IconType::RadioTower => {
            Some(crate::icons::common::icon_registry_elements::RADIOTOWER_ELEMENTS)
        }
        IconType::Radius => Some(crate::icons::common::icon_registry_elements::RADIUS_ELEMENTS),
        IconType::RailSymbol => {
            Some(crate::icons::common::icon_registry_elements::RAILSYMBOL_ELEMENTS)
        }
        IconType::Rainbow => Some(crate::icons::common::icon_registry_elements::RAINBOW_ELEMENTS),
        IconType::Rat => Some(crate::icons::common::icon_registry_elements::RAT_ELEMENTS),
        IconType::Ratio => Some(crate::icons::common::icon_registry_elements::RATIO_ELEMENTS),
        IconType::Receipt => Some(crate::icons::common::icon_registry_elements::RECEIPT_ELEMENTS),
        IconType::ReceiptCent => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTCENT_ELEMENTS)
        }
        IconType::ReceiptEuro => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTEURO_ELEMENTS)
        }
        IconType::ReceiptIndianRupee => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTINDIANRUPEE_ELEMENTS)
        }
        IconType::ReceiptJapaneseYen => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTJAPANESEYEN_ELEMENTS)
        }
        IconType::ReceiptPoundSterling => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTPOUNDSTERLING_ELEMENTS)
        }
        IconType::ReceiptRussianRuble => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTRUSSIANRUBLE_ELEMENTS)
        }
        IconType::ReceiptSwissFranc => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTSWISSFRANC_ELEMENTS)
        }
        IconType::ReceiptText => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTTEXT_ELEMENTS)
        }
        IconType::ReceiptTurkishLira => {
            Some(crate::icons::common::icon_registry_elements::RECEIPTTURKISHLIRA_ELEMENTS)
        }
        IconType::RectangleCircle => {
            Some(crate::icons::common::icon_registry_elements::RECTANGLECIRCLE_ELEMENTS)
        }
        IconType::RectangleEllipsis => {
            Some(crate::icons::common::icon_registry_elements::RECTANGLEELLIPSIS_ELEMENTS)
        }
        IconType::RectangleGoggles => {
            Some(crate::icons::common::icon_registry_elements::RECTANGLEGOGGLES_ELEMENTS)
        }
        IconType::RectangleHorizontal => {
            Some(crate::icons::common::icon_registry_elements::RECTANGLEHORIZONTAL_ELEMENTS)
        }
        IconType::RectangleVertical => {
            Some(crate::icons::common::icon_registry_elements::RECTANGLEVERTICAL_ELEMENTS)
        }
        IconType::Recycle => Some(crate::icons::common::icon_registry_elements::RECYCLE_ELEMENTS),
        IconType::Redo => Some(crate::icons::common::icon_registry_elements::REDO_ELEMENTS),
        IconType::Redo2 => Some(crate::icons::common::icon_registry_elements::REDO2_ELEMENTS),
        IconType::RedoDot => Some(crate::icons::common::icon_registry_elements::REDODOT_ELEMENTS),
        IconType::RefreshCcw => {
            Some(crate::icons::common::icon_registry_elements::REFRESHCCW_ELEMENTS)
        }
        IconType::RefreshCcwDot => {
            Some(crate::icons::common::icon_registry_elements::REFRESHCCWDOT_ELEMENTS)
        }
        IconType::RefreshCw => {
            Some(crate::icons::common::icon_registry_elements::REFRESHCW_ELEMENTS)
        }
        IconType::RefreshCwOff => {
            Some(crate::icons::common::icon_registry_elements::REFRESHCWOFF_ELEMENTS)
        }
        IconType::Refrigerator => {
            Some(crate::icons::common::icon_registry_elements::REFRIGERATOR_ELEMENTS)
        }
        IconType::Regex => Some(crate::icons::common::icon_registry_elements::REGEX_ELEMENTS),
        IconType::RemoveFormatting => {
            Some(crate::icons::common::icon_registry_elements::REMOVEFORMATTING_ELEMENTS)
        }
        IconType::Repeat => Some(crate::icons::common::icon_registry_elements::REPEAT_ELEMENTS),
        IconType::Repeat1 => Some(crate::icons::common::icon_registry_elements::REPEAT1_ELEMENTS),
        IconType::Repeat2 => Some(crate::icons::common::icon_registry_elements::REPEAT2_ELEMENTS),
        IconType::Replace => Some(crate::icons::common::icon_registry_elements::REPLACE_ELEMENTS),
        IconType::ReplaceAll => {
            Some(crate::icons::common::icon_registry_elements::REPLACEALL_ELEMENTS)
        }
        IconType::Reply => Some(crate::icons::common::icon_registry_elements::REPLY_ELEMENTS),
        IconType::ReplyAll => Some(crate::icons::common::icon_registry_elements::REPLYALL_ELEMENTS),
        IconType::Rewind => Some(crate::icons::common::icon_registry_elements::REWIND_ELEMENTS),
        IconType::Ribbon => Some(crate::icons::common::icon_registry_elements::RIBBON_ELEMENTS),
        IconType::Rocket => Some(crate::icons::common::icon_registry_elements::ROCKET_ELEMENTS),
        IconType::RockingChair => {
            Some(crate::icons::common::icon_registry_elements::ROCKINGCHAIR_ELEMENTS)
        }
        IconType::RollerCoaster => {
            Some(crate::icons::common::icon_registry_elements::ROLLERCOASTER_ELEMENTS)
        }
        IconType::Rotate3D => Some(crate::icons::common::icon_registry_elements::ROTATE3D_ELEMENTS),
        IconType::RotateCcw => {
            Some(crate::icons::common::icon_registry_elements::ROTATECCW_ELEMENTS)
        }
        IconType::RotateCcwKey => {
            Some(crate::icons::common::icon_registry_elements::ROTATECCWKEY_ELEMENTS)
        }
        IconType::RotateCcwSquare => {
            Some(crate::icons::common::icon_registry_elements::ROTATECCWSQUARE_ELEMENTS)
        }
        IconType::RotateCw => Some(crate::icons::common::icon_registry_elements::ROTATECW_ELEMENTS),
        IconType::RotateCwSquare => {
            Some(crate::icons::common::icon_registry_elements::ROTATECWSQUARE_ELEMENTS)
        }
        IconType::Route => Some(crate::icons::common::icon_registry_elements::ROUTE_ELEMENTS),
        IconType::RouteOff => Some(crate::icons::common::icon_registry_elements::ROUTEOFF_ELEMENTS),
        IconType::Router => Some(crate::icons::common::icon_registry_elements::ROUTER_ELEMENTS),
        IconType::Rows2 => Some(crate::icons::common::icon_registry_elements::ROWS2_ELEMENTS),
        IconType::Rows3 => Some(crate::icons::common::icon_registry_elements::ROWS3_ELEMENTS),
        IconType::Rows4 => Some(crate::icons::common::icon_registry_elements::ROWS4_ELEMENTS),
        IconType::Rss => Some(crate::icons::common::icon_registry_elements::RSS_ELEMENTS),
        IconType::Ruler => Some(crate::icons::common::icon_registry_elements::RULER_ELEMENTS),
        IconType::RulerDimensionLine => {
            Some(crate::icons::common::icon_registry_elements::RULERDIMENSIONLINE_ELEMENTS)
        }
        IconType::RussianRuble => {
            Some(crate::icons::common::icon_registry_elements::RUSSIANRUBLE_ELEMENTS)
        }
        IconType::Sailboat => Some(crate::icons::common::icon_registry_elements::SAILBOAT_ELEMENTS),
        IconType::Salad => Some(crate::icons::common::icon_registry_elements::SALAD_ELEMENTS),
        IconType::Sandwich => Some(crate::icons::common::icon_registry_elements::SANDWICH_ELEMENTS),
        IconType::Satellite => {
            Some(crate::icons::common::icon_registry_elements::SATELLITE_ELEMENTS)
        }
        IconType::SatelliteDish => {
            Some(crate::icons::common::icon_registry_elements::SATELLITEDISH_ELEMENTS)
        }
        IconType::SaudiRiyal => {
            Some(crate::icons::common::icon_registry_elements::SAUDIRIYAL_ELEMENTS)
        }
        IconType::Save => Some(crate::icons::common::icon_registry_elements::SAVE_ELEMENTS),
        IconType::SaveAll => Some(crate::icons::common::icon_registry_elements::SAVEALL_ELEMENTS),
        IconType::SaveOff => Some(crate::icons::common::icon_registry_elements::SAVEOFF_ELEMENTS),
        IconType::Scale => Some(crate::icons::common::icon_registry_elements::SCALE_ELEMENTS),
        IconType::Scale3D => Some(crate::icons::common::icon_registry_elements::SCALE3D_ELEMENTS),
        IconType::Scaling => Some(crate::icons::common::icon_registry_elements::SCALING_ELEMENTS),
        IconType::Scan => Some(crate::icons::common::icon_registry_elements::SCAN_ELEMENTS),
        IconType::ScanBarcode => {
            Some(crate::icons::common::icon_registry_elements::SCANBARCODE_ELEMENTS)
        }
        IconType::ScanEye => Some(crate::icons::common::icon_registry_elements::SCANEYE_ELEMENTS),
        IconType::ScanFace => Some(crate::icons::common::icon_registry_elements::SCANFACE_ELEMENTS),
        IconType::ScanHeart => {
            Some(crate::icons::common::icon_registry_elements::SCANHEART_ELEMENTS)
        }
        IconType::ScanLine => Some(crate::icons::common::icon_registry_elements::SCANLINE_ELEMENTS),
        IconType::ScanQrCode => {
            Some(crate::icons::common::icon_registry_elements::SCANQRCODE_ELEMENTS)
        }
        IconType::ScanSearch => {
            Some(crate::icons::common::icon_registry_elements::SCANSEARCH_ELEMENTS)
        }
        IconType::ScanText => Some(crate::icons::common::icon_registry_elements::SCANTEXT_ELEMENTS),
        IconType::School => Some(crate::icons::common::icon_registry_elements::SCHOOL_ELEMENTS),
        IconType::Scissors => Some(crate::icons::common::icon_registry_elements::SCISSORS_ELEMENTS),
        IconType::ScissorsLineDashed => {
            Some(crate::icons::common::icon_registry_elements::SCISSORSLINEDASHED_ELEMENTS)
        }
        IconType::ScreenShare => {
            Some(crate::icons::common::icon_registry_elements::SCREENSHARE_ELEMENTS)
        }
        IconType::ScreenShareOff => {
            Some(crate::icons::common::icon_registry_elements::SCREENSHAREOFF_ELEMENTS)
        }
        IconType::Scroll => Some(crate::icons::common::icon_registry_elements::SCROLL_ELEMENTS),
        IconType::ScrollText => {
            Some(crate::icons::common::icon_registry_elements::SCROLLTEXT_ELEMENTS)
        }
        IconType::Search => Some(crate::icons::common::icon_registry_elements::SEARCH_ELEMENTS),
        IconType::SearchCheck => {
            Some(crate::icons::common::icon_registry_elements::SEARCHCHECK_ELEMENTS)
        }
        IconType::SearchCode => {
            Some(crate::icons::common::icon_registry_elements::SEARCHCODE_ELEMENTS)
        }
        IconType::SearchSlash => {
            Some(crate::icons::common::icon_registry_elements::SEARCHSLASH_ELEMENTS)
        }
        IconType::SearchX => Some(crate::icons::common::icon_registry_elements::SEARCHX_ELEMENTS),
        IconType::Section => Some(crate::icons::common::icon_registry_elements::SECTION_ELEMENTS),
        IconType::Send => Some(crate::icons::common::icon_registry_elements::SEND_ELEMENTS),
        IconType::SendHorizontal => {
            Some(crate::icons::common::icon_registry_elements::SENDHORIZONTAL_ELEMENTS)
        }
        IconType::SendToBack => {
            Some(crate::icons::common::icon_registry_elements::SENDTOBACK_ELEMENTS)
        }
        IconType::SeparatorHorizontal => {
            Some(crate::icons::common::icon_registry_elements::SEPARATORHORIZONTAL_ELEMENTS)
        }
        IconType::SeparatorVertical => {
            Some(crate::icons::common::icon_registry_elements::SEPARATORVERTICAL_ELEMENTS)
        }
        IconType::Server => Some(crate::icons::common::icon_registry_elements::SERVER_ELEMENTS),
        IconType::ServerCog => {
            Some(crate::icons::common::icon_registry_elements::SERVERCOG_ELEMENTS)
        }
        IconType::ServerCrash => {
            Some(crate::icons::common::icon_registry_elements::SERVERCRASH_ELEMENTS)
        }
        IconType::ServerOff => {
            Some(crate::icons::common::icon_registry_elements::SERVEROFF_ELEMENTS)
        }
        IconType::Settings => Some(crate::icons::common::icon_registry_elements::SETTINGS_ELEMENTS),
        IconType::Settings2 => {
            Some(crate::icons::common::icon_registry_elements::SETTINGS2_ELEMENTS)
        }
        IconType::Shapes => Some(crate::icons::common::icon_registry_elements::SHAPES_ELEMENTS),
        IconType::Share => Some(crate::icons::common::icon_registry_elements::SHARE_ELEMENTS),
        IconType::Share2 => Some(crate::icons::common::icon_registry_elements::SHARE2_ELEMENTS),
        IconType::Sheet => Some(crate::icons::common::icon_registry_elements::SHEET_ELEMENTS),
        IconType::Shell => Some(crate::icons::common::icon_registry_elements::SHELL_ELEMENTS),
        IconType::Shield => Some(crate::icons::common::icon_registry_elements::SHIELD_ELEMENTS),
        IconType::ShieldAlert => {
            Some(crate::icons::common::icon_registry_elements::SHIELDALERT_ELEMENTS)
        }
        IconType::ShieldBan => {
            Some(crate::icons::common::icon_registry_elements::SHIELDBAN_ELEMENTS)
        }
        IconType::ShieldCheck => {
            Some(crate::icons::common::icon_registry_elements::SHIELDCHECK_ELEMENTS)
        }
        IconType::ShieldEllipsis => {
            Some(crate::icons::common::icon_registry_elements::SHIELDELLIPSIS_ELEMENTS)
        }
        IconType::ShieldHalf => {
            Some(crate::icons::common::icon_registry_elements::SHIELDHALF_ELEMENTS)
        }
        IconType::ShieldMinus => {
            Some(crate::icons::common::icon_registry_elements::SHIELDMINUS_ELEMENTS)
        }
        IconType::ShieldOff => {
            Some(crate::icons::common::icon_registry_elements::SHIELDOFF_ELEMENTS)
        }
        IconType::ShieldPlus => {
            Some(crate::icons::common::icon_registry_elements::SHIELDPLUS_ELEMENTS)
        }
        IconType::ShieldQuestion => {
            Some(crate::icons::common::icon_registry_elements::SHIELDQUESTION_ELEMENTS)
        }
        IconType::ShieldQuestionMark => {
            Some(crate::icons::common::icon_registry_elements::SHIELDQUESTIONMARK_ELEMENTS)
        }
        IconType::ShieldUser => {
            Some(crate::icons::common::icon_registry_elements::SHIELDUSER_ELEMENTS)
        }
        IconType::ShieldX => Some(crate::icons::common::icon_registry_elements::SHIELDX_ELEMENTS),
        IconType::Ship => Some(crate::icons::common::icon_registry_elements::SHIP_ELEMENTS),
        IconType::ShipWheel => {
            Some(crate::icons::common::icon_registry_elements::SHIPWHEEL_ELEMENTS)
        }
        IconType::Shirt => Some(crate::icons::common::icon_registry_elements::SHIRT_ELEMENTS),
        IconType::ShoppingBag => {
            Some(crate::icons::common::icon_registry_elements::SHOPPINGBAG_ELEMENTS)
        }
        IconType::ShoppingBasket => {
            Some(crate::icons::common::icon_registry_elements::SHOPPINGBASKET_ELEMENTS)
        }
        IconType::ShoppingCart => {
            Some(crate::icons::common::icon_registry_elements::SHOPPINGCART_ELEMENTS)
        }
        IconType::Shovel => Some(crate::icons::common::icon_registry_elements::SHOVEL_ELEMENTS),
        IconType::ShowerHead => {
            Some(crate::icons::common::icon_registry_elements::SHOWERHEAD_ELEMENTS)
        }
        IconType::Shredder => Some(crate::icons::common::icon_registry_elements::SHREDDER_ELEMENTS),
        IconType::Shrimp => Some(crate::icons::common::icon_registry_elements::SHRIMP_ELEMENTS),
        IconType::Shrink => Some(crate::icons::common::icon_registry_elements::SHRINK_ELEMENTS),
        IconType::Shrub => Some(crate::icons::common::icon_registry_elements::SHRUB_ELEMENTS),
        IconType::Shuffle => Some(crate::icons::common::icon_registry_elements::SHUFFLE_ELEMENTS),
        IconType::Sigma => Some(crate::icons::common::icon_registry_elements::SIGMA_ELEMENTS),
        IconType::Signal => Some(crate::icons::common::icon_registry_elements::SIGNAL_ELEMENTS),
        IconType::SignalHigh => {
            Some(crate::icons::common::icon_registry_elements::SIGNALHIGH_ELEMENTS)
        }
        IconType::SignalLow => {
            Some(crate::icons::common::icon_registry_elements::SIGNALLOW_ELEMENTS)
        }
        IconType::SignalMedium => {
            Some(crate::icons::common::icon_registry_elements::SIGNALMEDIUM_ELEMENTS)
        }
        IconType::SignalZero => {
            Some(crate::icons::common::icon_registry_elements::SIGNALZERO_ELEMENTS)
        }
        IconType::Signature => {
            Some(crate::icons::common::icon_registry_elements::SIGNATURE_ELEMENTS)
        }
        IconType::Signpost => Some(crate::icons::common::icon_registry_elements::SIGNPOST_ELEMENTS),
        IconType::SignpostBig => {
            Some(crate::icons::common::icon_registry_elements::SIGNPOSTBIG_ELEMENTS)
        }
        IconType::Siren => Some(crate::icons::common::icon_registry_elements::SIREN_ELEMENTS),
        IconType::SkipBack => Some(crate::icons::common::icon_registry_elements::SKIPBACK_ELEMENTS),
        IconType::SkipForward => {
            Some(crate::icons::common::icon_registry_elements::SKIPFORWARD_ELEMENTS)
        }
        IconType::Skull => Some(crate::icons::common::icon_registry_elements::SKULL_ELEMENTS),
        IconType::Slack => Some(crate::icons::common::icon_registry_elements::SLACK_ELEMENTS),
        IconType::Slash => Some(crate::icons::common::icon_registry_elements::SLASH_ELEMENTS),
        IconType::Slice => Some(crate::icons::common::icon_registry_elements::SLICE_ELEMENTS),
        IconType::SlidersHorizontal => {
            Some(crate::icons::common::icon_registry_elements::SLIDERSHORIZONTAL_ELEMENTS)
        }
        IconType::SlidersVertical => {
            Some(crate::icons::common::icon_registry_elements::SLIDERSVERTICAL_ELEMENTS)
        }
        IconType::Smartphone => {
            Some(crate::icons::common::icon_registry_elements::SMARTPHONE_ELEMENTS)
        }
        IconType::SmartphoneCharging => {
            Some(crate::icons::common::icon_registry_elements::SMARTPHONECHARGING_ELEMENTS)
        }
        IconType::SmartphoneNfc => {
            Some(crate::icons::common::icon_registry_elements::SMARTPHONENFC_ELEMENTS)
        }
        IconType::Smile => Some(crate::icons::common::icon_registry_elements::SMILE_ELEMENTS),
        IconType::SmilePlus => {
            Some(crate::icons::common::icon_registry_elements::SMILEPLUS_ELEMENTS)
        }
        IconType::Snail => Some(crate::icons::common::icon_registry_elements::SNAIL_ELEMENTS),
        IconType::Snowflake => {
            Some(crate::icons::common::icon_registry_elements::SNOWFLAKE_ELEMENTS)
        }
        IconType::SoapDispenserDroplet => {
            Some(crate::icons::common::icon_registry_elements::SOAPDISPENSERDROPLET_ELEMENTS)
        }
        IconType::Sofa => Some(crate::icons::common::icon_registry_elements::SOFA_ELEMENTS),
        IconType::Soup => Some(crate::icons::common::icon_registry_elements::SOUP_ELEMENTS),
        IconType::Space => Some(crate::icons::common::icon_registry_elements::SPACE_ELEMENTS),
        IconType::Spade => Some(crate::icons::common::icon_registry_elements::SPADE_ELEMENTS),
        IconType::Sparkle => Some(crate::icons::common::icon_registry_elements::SPARKLE_ELEMENTS),
        IconType::Sparkles => Some(crate::icons::common::icon_registry_elements::SPARKLES_ELEMENTS),
        IconType::Speaker => Some(crate::icons::common::icon_registry_elements::SPEAKER_ELEMENTS),
        IconType::Speech => Some(crate::icons::common::icon_registry_elements::SPEECH_ELEMENTS),
        IconType::SpellCheck => {
            Some(crate::icons::common::icon_registry_elements::SPELLCHECK_ELEMENTS)
        }
        IconType::SpellCheck2 => {
            Some(crate::icons::common::icon_registry_elements::SPELLCHECK2_ELEMENTS)
        }
        IconType::Spline => Some(crate::icons::common::icon_registry_elements::SPLINE_ELEMENTS),
        IconType::SplinePointer => {
            Some(crate::icons::common::icon_registry_elements::SPLINEPOINTER_ELEMENTS)
        }
        IconType::Split => Some(crate::icons::common::icon_registry_elements::SPLIT_ELEMENTS),
        IconType::Spool => Some(crate::icons::common::icon_registry_elements::SPOOL_ELEMENTS),
        IconType::Spotlight => {
            Some(crate::icons::common::icon_registry_elements::SPOTLIGHT_ELEMENTS)
        }
        IconType::SprayCan => Some(crate::icons::common::icon_registry_elements::SPRAYCAN_ELEMENTS),
        IconType::Sprout => Some(crate::icons::common::icon_registry_elements::SPROUT_ELEMENTS),
        IconType::Square => Some(crate::icons::common::icon_registry_elements::SQUARE_ELEMENTS),
        IconType::SquareActivity => {
            Some(crate::icons::common::icon_registry_elements::SQUAREACTIVITY_ELEMENTS)
        }
        IconType::SquareArrowDown => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWDOWN_ELEMENTS)
        }
        IconType::SquareArrowDownLeft => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWDOWNLEFT_ELEMENTS)
        }
        IconType::SquareArrowDownRight => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWDOWNRIGHT_ELEMENTS)
        }
        IconType::SquareArrowLeft => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWLEFT_ELEMENTS)
        }
        IconType::SquareArrowOutDownLeft => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWOUTDOWNLEFT_ELEMENTS)
        }
        IconType::SquareArrowOutDownRight => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWOUTDOWNRIGHT_ELEMENTS)
        }
        IconType::SquareArrowOutUpLeft => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWOUTUPLEFT_ELEMENTS)
        }
        IconType::SquareArrowOutUpRight => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWOUTUPRIGHT_ELEMENTS)
        }
        IconType::SquareArrowRight => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWRIGHT_ELEMENTS)
        }
        IconType::SquareArrowUp => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWUP_ELEMENTS)
        }
        IconType::SquareArrowUpLeft => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWUPLEFT_ELEMENTS)
        }
        IconType::SquareArrowUpRight => {
            Some(crate::icons::common::icon_registry_elements::SQUAREARROWUPRIGHT_ELEMENTS)
        }
        IconType::SquareAsterisk => {
            Some(crate::icons::common::icon_registry_elements::SQUAREASTERISK_ELEMENTS)
        }
        IconType::SquareBottomDashedScissors => {
            Some(crate::icons::common::icon_registry_elements::SQUAREBOTTOMDASHEDSCISSORS_ELEMENTS)
        }
        IconType::SquareChartGantt => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHARTGANTT_ELEMENTS)
        }
        IconType::SquareCheck => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHECK_ELEMENTS)
        }
        IconType::SquareCheckBig => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHECKBIG_ELEMENTS)
        }
        IconType::SquareChevronDown => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHEVRONDOWN_ELEMENTS)
        }
        IconType::SquareChevronLeft => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHEVRONLEFT_ELEMENTS)
        }
        IconType::SquareChevronRight => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHEVRONRIGHT_ELEMENTS)
        }
        IconType::SquareChevronUp => {
            Some(crate::icons::common::icon_registry_elements::SQUARECHEVRONUP_ELEMENTS)
        }
        IconType::SquareCode => {
            Some(crate::icons::common::icon_registry_elements::SQUARECODE_ELEMENTS)
        }
        IconType::SquareDashed => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDASHED_ELEMENTS)
        }
        IconType::SquareDashedBottom => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDASHEDBOTTOM_ELEMENTS)
        }
        IconType::SquareDashedBottomCode => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDASHEDBOTTOMCODE_ELEMENTS)
        }
        IconType::SquareDashedKanban => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDASHEDKANBAN_ELEMENTS)
        }
        IconType::SquareDashedMousePointer => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDASHEDMOUSEPOINTER_ELEMENTS)
        }
        IconType::SquareDashedTopSolid => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDASHEDTOPSOLID_ELEMENTS)
        }
        IconType::SquareDivide => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDIVIDE_ELEMENTS)
        }
        IconType::SquareDot => {
            Some(crate::icons::common::icon_registry_elements::SQUAREDOT_ELEMENTS)
        }
        IconType::SquareEqual => {
            Some(crate::icons::common::icon_registry_elements::SQUAREEQUAL_ELEMENTS)
        }
        IconType::SquareFunction => {
            Some(crate::icons::common::icon_registry_elements::SQUAREFUNCTION_ELEMENTS)
        }
        IconType::SquareKanban => {
            Some(crate::icons::common::icon_registry_elements::SQUAREKANBAN_ELEMENTS)
        }
        IconType::SquareLibrary => {
            Some(crate::icons::common::icon_registry_elements::SQUARELIBRARY_ELEMENTS)
        }
        IconType::SquareM => Some(crate::icons::common::icon_registry_elements::SQUAREM_ELEMENTS),
        IconType::SquareMenu => {
            Some(crate::icons::common::icon_registry_elements::SQUAREMENU_ELEMENTS)
        }
        IconType::SquareMinus => {
            Some(crate::icons::common::icon_registry_elements::SQUAREMINUS_ELEMENTS)
        }
        IconType::SquareMousePointer => {
            Some(crate::icons::common::icon_registry_elements::SQUAREMOUSEPOINTER_ELEMENTS)
        }
        IconType::SquareParking => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPARKING_ELEMENTS)
        }
        IconType::SquareParkingOff => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPARKINGOFF_ELEMENTS)
        }
        IconType::SquarePause => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPAUSE_ELEMENTS)
        }
        IconType::SquarePen => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPEN_ELEMENTS)
        }
        IconType::SquarePercent => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPERCENT_ELEMENTS)
        }
        IconType::SquarePi => Some(crate::icons::common::icon_registry_elements::SQUAREPI_ELEMENTS),
        IconType::SquarePilcrow => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPILCROW_ELEMENTS)
        }
        IconType::SquarePlay => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPLAY_ELEMENTS)
        }
        IconType::SquarePlus => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPLUS_ELEMENTS)
        }
        IconType::SquarePower => {
            Some(crate::icons::common::icon_registry_elements::SQUAREPOWER_ELEMENTS)
        }
        IconType::SquareRadical => {
            Some(crate::icons::common::icon_registry_elements::SQUARERADICAL_ELEMENTS)
        }
        IconType::SquareRoundCorner => {
            Some(crate::icons::common::icon_registry_elements::SQUAREROUNDCORNER_ELEMENTS)
        }
        IconType::SquareScissors => {
            Some(crate::icons::common::icon_registry_elements::SQUARESCISSORS_ELEMENTS)
        }
        IconType::SquareSigma => {
            Some(crate::icons::common::icon_registry_elements::SQUARESIGMA_ELEMENTS)
        }
        IconType::SquareSlash => {
            Some(crate::icons::common::icon_registry_elements::SQUARESLASH_ELEMENTS)
        }
        IconType::SquareSplitHorizontal => {
            Some(crate::icons::common::icon_registry_elements::SQUARESPLITHORIZONTAL_ELEMENTS)
        }
        IconType::SquareSplitVertical => {
            Some(crate::icons::common::icon_registry_elements::SQUARESPLITVERTICAL_ELEMENTS)
        }
        IconType::SquareSquare => {
            Some(crate::icons::common::icon_registry_elements::SQUARESQUARE_ELEMENTS)
        }
        IconType::SquareStack => {
            Some(crate::icons::common::icon_registry_elements::SQUARESTACK_ELEMENTS)
        }
        IconType::SquareStop => {
            Some(crate::icons::common::icon_registry_elements::SQUARESTOP_ELEMENTS)
        }
        IconType::SquareTerminal => {
            Some(crate::icons::common::icon_registry_elements::SQUARETERMINAL_ELEMENTS)
        }
        IconType::SquareUser => {
            Some(crate::icons::common::icon_registry_elements::SQUAREUSER_ELEMENTS)
        }
        IconType::SquareUserRound => {
            Some(crate::icons::common::icon_registry_elements::SQUAREUSERROUND_ELEMENTS)
        }
        IconType::SquareX => Some(crate::icons::common::icon_registry_elements::SQUAREX_ELEMENTS),
        IconType::SquaresExclude => {
            Some(crate::icons::common::icon_registry_elements::SQUARESEXCLUDE_ELEMENTS)
        }
        IconType::SquaresIntersect => {
            Some(crate::icons::common::icon_registry_elements::SQUARESINTERSECT_ELEMENTS)
        }
        IconType::SquaresSubtract => {
            Some(crate::icons::common::icon_registry_elements::SQUARESSUBTRACT_ELEMENTS)
        }
        IconType::SquaresUnite => {
            Some(crate::icons::common::icon_registry_elements::SQUARESUNITE_ELEMENTS)
        }
        IconType::Squircle => Some(crate::icons::common::icon_registry_elements::SQUIRCLE_ELEMENTS),
        IconType::SquircleDashed => {
            Some(crate::icons::common::icon_registry_elements::SQUIRCLEDASHED_ELEMENTS)
        }
        IconType::Squirrel => Some(crate::icons::common::icon_registry_elements::SQUIRREL_ELEMENTS),
        IconType::Stamp => Some(crate::icons::common::icon_registry_elements::STAMP_ELEMENTS),
        IconType::Star => Some(crate::icons::common::icon_registry_elements::STAR_ELEMENTS),
        IconType::StarHalf => Some(crate::icons::common::icon_registry_elements::STARHALF_ELEMENTS),
        IconType::StarOff => Some(crate::icons::common::icon_registry_elements::STAROFF_ELEMENTS),
        IconType::StepBack => Some(crate::icons::common::icon_registry_elements::STEPBACK_ELEMENTS),
        IconType::StepForward => {
            Some(crate::icons::common::icon_registry_elements::STEPFORWARD_ELEMENTS)
        }
        IconType::Stethoscope => {
            Some(crate::icons::common::icon_registry_elements::STETHOSCOPE_ELEMENTS)
        }
        IconType::Sticker => Some(crate::icons::common::icon_registry_elements::STICKER_ELEMENTS),
        IconType::StickyNote => {
            Some(crate::icons::common::icon_registry_elements::STICKYNOTE_ELEMENTS)
        }
        IconType::Store => Some(crate::icons::common::icon_registry_elements::STORE_ELEMENTS),
        IconType::StretchHorizontal => {
            Some(crate::icons::common::icon_registry_elements::STRETCHHORIZONTAL_ELEMENTS)
        }
        IconType::StretchVertical => {
            Some(crate::icons::common::icon_registry_elements::STRETCHVERTICAL_ELEMENTS)
        }
        IconType::Strikethrough => {
            Some(crate::icons::common::icon_registry_elements::STRIKETHROUGH_ELEMENTS)
        }
        IconType::Subscript => {
            Some(crate::icons::common::icon_registry_elements::SUBSCRIPT_ELEMENTS)
        }
        IconType::Sun => Some(crate::icons::common::icon_registry_elements::SUN_ELEMENTS),
        IconType::SunDim => Some(crate::icons::common::icon_registry_elements::SUNDIM_ELEMENTS),
        IconType::SunMedium => {
            Some(crate::icons::common::icon_registry_elements::SUNMEDIUM_ELEMENTS)
        }
        IconType::SunMoon => Some(crate::icons::common::icon_registry_elements::SUNMOON_ELEMENTS),
        IconType::SunSnow => Some(crate::icons::common::icon_registry_elements::SUNSNOW_ELEMENTS),
        IconType::Sunrise => Some(crate::icons::common::icon_registry_elements::SUNRISE_ELEMENTS),
        IconType::Sunset => Some(crate::icons::common::icon_registry_elements::SUNSET_ELEMENTS),
        IconType::Superscript => {
            Some(crate::icons::common::icon_registry_elements::SUPERSCRIPT_ELEMENTS)
        }
        IconType::SwatchBook => {
            Some(crate::icons::common::icon_registry_elements::SWATCHBOOK_ELEMENTS)
        }
        IconType::SwissFranc => {
            Some(crate::icons::common::icon_registry_elements::SWISSFRANC_ELEMENTS)
        }
        IconType::SwitchCamera => {
            Some(crate::icons::common::icon_registry_elements::SWITCHCAMERA_ELEMENTS)
        }
        IconType::Sword => Some(crate::icons::common::icon_registry_elements::SWORD_ELEMENTS),
        IconType::Swords => Some(crate::icons::common::icon_registry_elements::SWORDS_ELEMENTS),
        IconType::Syringe => Some(crate::icons::common::icon_registry_elements::SYRINGE_ELEMENTS),
        IconType::Table => Some(crate::icons::common::icon_registry_elements::TABLE_ELEMENTS),
        IconType::Table2 => Some(crate::icons::common::icon_registry_elements::TABLE2_ELEMENTS),
        IconType::TableCellsMerge => {
            Some(crate::icons::common::icon_registry_elements::TABLECELLSMERGE_ELEMENTS)
        }
        IconType::TableCellsSplit => {
            Some(crate::icons::common::icon_registry_elements::TABLECELLSSPLIT_ELEMENTS)
        }
        IconType::TableColumnsSplit => {
            Some(crate::icons::common::icon_registry_elements::TABLECOLUMNSSPLIT_ELEMENTS)
        }
        IconType::TableOfContents => {
            Some(crate::icons::common::icon_registry_elements::TABLEOFCONTENTS_ELEMENTS)
        }
        IconType::TableProperties => {
            Some(crate::icons::common::icon_registry_elements::TABLEPROPERTIES_ELEMENTS)
        }
        IconType::TableRowsSplit => {
            Some(crate::icons::common::icon_registry_elements::TABLEROWSSPLIT_ELEMENTS)
        }
        IconType::Tablet => Some(crate::icons::common::icon_registry_elements::TABLET_ELEMENTS),
        IconType::TabletSmartphone => {
            Some(crate::icons::common::icon_registry_elements::TABLETSMARTPHONE_ELEMENTS)
        }
        IconType::Tablets => Some(crate::icons::common::icon_registry_elements::TABLETS_ELEMENTS),
        IconType::Tag => Some(crate::icons::common::icon_registry_elements::TAG_ELEMENTS),
        IconType::Tags => Some(crate::icons::common::icon_registry_elements::TAGS_ELEMENTS),
        IconType::Tally1 => Some(crate::icons::common::icon_registry_elements::TALLY1_ELEMENTS),
        IconType::Tally2 => Some(crate::icons::common::icon_registry_elements::TALLY2_ELEMENTS),
        IconType::Tally3 => Some(crate::icons::common::icon_registry_elements::TALLY3_ELEMENTS),
        IconType::Tally4 => Some(crate::icons::common::icon_registry_elements::TALLY4_ELEMENTS),
        IconType::Tally5 => Some(crate::icons::common::icon_registry_elements::TALLY5_ELEMENTS),
        IconType::Tangent => Some(crate::icons::common::icon_registry_elements::TANGENT_ELEMENTS),
        IconType::Target => Some(crate::icons::common::icon_registry_elements::TARGET_ELEMENTS),
        IconType::Telescope => {
            Some(crate::icons::common::icon_registry_elements::TELESCOPE_ELEMENTS)
        }
        IconType::Tent => Some(crate::icons::common::icon_registry_elements::TENT_ELEMENTS),
        IconType::TentTree => Some(crate::icons::common::icon_registry_elements::TENTTREE_ELEMENTS),
        IconType::Terminal => Some(crate::icons::common::icon_registry_elements::TERMINAL_ELEMENTS),
        IconType::TestTube => Some(crate::icons::common::icon_registry_elements::TESTTUBE_ELEMENTS),
        IconType::TestTubeDiagonal => {
            Some(crate::icons::common::icon_registry_elements::TESTTUBEDIAGONAL_ELEMENTS)
        }
        IconType::TestTubes => {
            Some(crate::icons::common::icon_registry_elements::TESTTUBES_ELEMENTS)
        }
        IconType::Text => Some(crate::icons::common::icon_registry_elements::TEXT_ELEMENTS),
        IconType::TextCursor => {
            Some(crate::icons::common::icon_registry_elements::TEXTCURSOR_ELEMENTS)
        }
        IconType::TextCursorInput => {
            Some(crate::icons::common::icon_registry_elements::TEXTCURSORINPUT_ELEMENTS)
        }
        IconType::TextQuote => {
            Some(crate::icons::common::icon_registry_elements::TEXTQUOTE_ELEMENTS)
        }
        IconType::TextSearch => {
            Some(crate::icons::common::icon_registry_elements::TEXTSEARCH_ELEMENTS)
        }
        IconType::TextSelect => {
            Some(crate::icons::common::icon_registry_elements::TEXTSELECT_ELEMENTS)
        }
        IconType::Theater => Some(crate::icons::common::icon_registry_elements::THEATER_ELEMENTS),
        IconType::Thermometer => {
            Some(crate::icons::common::icon_registry_elements::THERMOMETER_ELEMENTS)
        }
        IconType::ThermometerSnowflake => {
            Some(crate::icons::common::icon_registry_elements::THERMOMETERSNOWFLAKE_ELEMENTS)
        }
        IconType::ThermometerSun => {
            Some(crate::icons::common::icon_registry_elements::THERMOMETERSUN_ELEMENTS)
        }
        IconType::ThumbsDown => {
            Some(crate::icons::common::icon_registry_elements::THUMBSDOWN_ELEMENTS)
        }
        IconType::ThumbsUp => Some(crate::icons::common::icon_registry_elements::THUMBSUP_ELEMENTS),
        IconType::Ticket => Some(crate::icons::common::icon_registry_elements::TICKET_ELEMENTS),
        IconType::TicketCheck => {
            Some(crate::icons::common::icon_registry_elements::TICKETCHECK_ELEMENTS)
        }
        IconType::TicketMinus => {
            Some(crate::icons::common::icon_registry_elements::TICKETMINUS_ELEMENTS)
        }
        IconType::TicketPercent => {
            Some(crate::icons::common::icon_registry_elements::TICKETPERCENT_ELEMENTS)
        }
        IconType::TicketPlus => {
            Some(crate::icons::common::icon_registry_elements::TICKETPLUS_ELEMENTS)
        }
        IconType::TicketSlash => {
            Some(crate::icons::common::icon_registry_elements::TICKETSLASH_ELEMENTS)
        }
        IconType::TicketX => Some(crate::icons::common::icon_registry_elements::TICKETX_ELEMENTS),
        IconType::Tickets => Some(crate::icons::common::icon_registry_elements::TICKETS_ELEMENTS),
        IconType::TicketsPlane => {
            Some(crate::icons::common::icon_registry_elements::TICKETSPLANE_ELEMENTS)
        }
        IconType::Timer => Some(crate::icons::common::icon_registry_elements::TIMER_ELEMENTS),
        IconType::TimerOff => Some(crate::icons::common::icon_registry_elements::TIMEROFF_ELEMENTS),
        IconType::TimerReset => {
            Some(crate::icons::common::icon_registry_elements::TIMERRESET_ELEMENTS)
        }
        IconType::ToggleLeft => {
            Some(crate::icons::common::icon_registry_elements::TOGGLELEFT_ELEMENTS)
        }
        IconType::ToggleRight => {
            Some(crate::icons::common::icon_registry_elements::TOGGLERIGHT_ELEMENTS)
        }
        IconType::Toilet => Some(crate::icons::common::icon_registry_elements::TOILET_ELEMENTS),
        IconType::ToolCase => Some(crate::icons::common::icon_registry_elements::TOOLCASE_ELEMENTS),
        IconType::Tornado => Some(crate::icons::common::icon_registry_elements::TORNADO_ELEMENTS),
        IconType::Torus => Some(crate::icons::common::icon_registry_elements::TORUS_ELEMENTS),
        IconType::Touchpad => Some(crate::icons::common::icon_registry_elements::TOUCHPAD_ELEMENTS),
        IconType::TouchpadOff => {
            Some(crate::icons::common::icon_registry_elements::TOUCHPADOFF_ELEMENTS)
        }
        IconType::TowerControl => {
            Some(crate::icons::common::icon_registry_elements::TOWERCONTROL_ELEMENTS)
        }
        IconType::ToyBrick => Some(crate::icons::common::icon_registry_elements::TOYBRICK_ELEMENTS),
        IconType::Tractor => Some(crate::icons::common::icon_registry_elements::TRACTOR_ELEMENTS),
        IconType::TrafficCone => {
            Some(crate::icons::common::icon_registry_elements::TRAFFICCONE_ELEMENTS)
        }
        IconType::TrainFront => {
            Some(crate::icons::common::icon_registry_elements::TRAINFRONT_ELEMENTS)
        }
        IconType::TrainFrontTunnel => {
            Some(crate::icons::common::icon_registry_elements::TRAINFRONTTUNNEL_ELEMENTS)
        }
        IconType::TrainTrack => {
            Some(crate::icons::common::icon_registry_elements::TRAINTRACK_ELEMENTS)
        }
        IconType::TramFront => {
            Some(crate::icons::common::icon_registry_elements::TRAMFRONT_ELEMENTS)
        }
        IconType::Transgender => {
            Some(crate::icons::common::icon_registry_elements::TRANSGENDER_ELEMENTS)
        }
        IconType::Trash => Some(crate::icons::common::icon_registry_elements::TRASH_ELEMENTS),
        IconType::Trash2 => Some(crate::icons::common::icon_registry_elements::TRASH2_ELEMENTS),
        IconType::TreeDeciduous => {
            Some(crate::icons::common::icon_registry_elements::TREEDECIDUOUS_ELEMENTS)
        }
        IconType::TreePalm => Some(crate::icons::common::icon_registry_elements::TREEPALM_ELEMENTS),
        IconType::TreePine => Some(crate::icons::common::icon_registry_elements::TREEPINE_ELEMENTS),
        IconType::Trees => Some(crate::icons::common::icon_registry_elements::TREES_ELEMENTS),
        IconType::Trello => Some(crate::icons::common::icon_registry_elements::TRELLO_ELEMENTS),
        IconType::TrendingDown => {
            Some(crate::icons::common::icon_registry_elements::TRENDINGDOWN_ELEMENTS)
        }
        IconType::TrendingUp => {
            Some(crate::icons::common::icon_registry_elements::TRENDINGUP_ELEMENTS)
        }
        IconType::TrendingUpDown => {
            Some(crate::icons::common::icon_registry_elements::TRENDINGUPDOWN_ELEMENTS)
        }
        IconType::Triangle => Some(crate::icons::common::icon_registry_elements::TRIANGLE_ELEMENTS),
        IconType::TriangleAlert => {
            Some(crate::icons::common::icon_registry_elements::TRIANGLEALERT_ELEMENTS)
        }
        IconType::TriangleDashed => {
            Some(crate::icons::common::icon_registry_elements::TRIANGLEDASHED_ELEMENTS)
        }
        IconType::TriangleRight => {
            Some(crate::icons::common::icon_registry_elements::TRIANGLERIGHT_ELEMENTS)
        }
        IconType::Trophy => Some(crate::icons::common::icon_registry_elements::TROPHY_ELEMENTS),
        IconType::Truck => Some(crate::icons::common::icon_registry_elements::TRUCK_ELEMENTS),
        IconType::TruckElectric => {
            Some(crate::icons::common::icon_registry_elements::TRUCKELECTRIC_ELEMENTS)
        }
        IconType::TurkishLira => {
            Some(crate::icons::common::icon_registry_elements::TURKISHLIRA_ELEMENTS)
        }
        IconType::Turtle => Some(crate::icons::common::icon_registry_elements::TURTLE_ELEMENTS),
        IconType::Tv => Some(crate::icons::common::icon_registry_elements::TV_ELEMENTS),
        IconType::TvMinimal => {
            Some(crate::icons::common::icon_registry_elements::TVMINIMAL_ELEMENTS)
        }
        IconType::TvMinimalPlay => {
            Some(crate::icons::common::icon_registry_elements::TVMINIMALPLAY_ELEMENTS)
        }
        IconType::Twitch => Some(crate::icons::common::icon_registry_elements::TWITCH_ELEMENTS),
        IconType::Twitter => Some(crate::icons::common::icon_registry_elements::TWITTER_ELEMENTS),
        IconType::Type => Some(crate::icons::common::icon_registry_elements::TYPE_ELEMENTS),
        IconType::TypeOutline => {
            Some(crate::icons::common::icon_registry_elements::TYPEOUTLINE_ELEMENTS)
        }
        IconType::Umbrella => Some(crate::icons::common::icon_registry_elements::UMBRELLA_ELEMENTS),
        IconType::UmbrellaOff => {
            Some(crate::icons::common::icon_registry_elements::UMBRELLAOFF_ELEMENTS)
        }
        IconType::Underline => {
            Some(crate::icons::common::icon_registry_elements::UNDERLINE_ELEMENTS)
        }
        IconType::Undo => Some(crate::icons::common::icon_registry_elements::UNDO_ELEMENTS),
        IconType::Undo2 => Some(crate::icons::common::icon_registry_elements::UNDO2_ELEMENTS),
        IconType::UndoDot => Some(crate::icons::common::icon_registry_elements::UNDODOT_ELEMENTS),
        IconType::UnfoldHorizontal => {
            Some(crate::icons::common::icon_registry_elements::UNFOLDHORIZONTAL_ELEMENTS)
        }
        IconType::UnfoldVertical => {
            Some(crate::icons::common::icon_registry_elements::UNFOLDVERTICAL_ELEMENTS)
        }
        IconType::Ungroup => Some(crate::icons::common::icon_registry_elements::UNGROUP_ELEMENTS),
        IconType::University => {
            Some(crate::icons::common::icon_registry_elements::UNIVERSITY_ELEMENTS)
        }
        IconType::Unlink => Some(crate::icons::common::icon_registry_elements::UNLINK_ELEMENTS),
        IconType::Unlink2 => Some(crate::icons::common::icon_registry_elements::UNLINK2_ELEMENTS),
        IconType::Unplug => Some(crate::icons::common::icon_registry_elements::UNPLUG_ELEMENTS),
        IconType::Upload => Some(crate::icons::common::icon_registry_elements::UPLOAD_ELEMENTS),
        IconType::Usb => Some(crate::icons::common::icon_registry_elements::USB_ELEMENTS),
        IconType::User => Some(crate::icons::common::icon_registry_elements::USER_ELEMENTS),
        IconType::UserCheck => {
            Some(crate::icons::common::icon_registry_elements::USERCHECK_ELEMENTS)
        }
        IconType::UserCog => Some(crate::icons::common::icon_registry_elements::USERCOG_ELEMENTS),
        IconType::UserLock => Some(crate::icons::common::icon_registry_elements::USERLOCK_ELEMENTS),
        IconType::UserMinus => {
            Some(crate::icons::common::icon_registry_elements::USERMINUS_ELEMENTS)
        }
        IconType::UserPen => Some(crate::icons::common::icon_registry_elements::USERPEN_ELEMENTS),
        IconType::UserPlus => Some(crate::icons::common::icon_registry_elements::USERPLUS_ELEMENTS),
        IconType::UserRound => {
            Some(crate::icons::common::icon_registry_elements::USERROUND_ELEMENTS)
        }
        IconType::UserRoundCheck => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDCHECK_ELEMENTS)
        }
        IconType::UserRoundCog => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDCOG_ELEMENTS)
        }
        IconType::UserRoundMinus => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDMINUS_ELEMENTS)
        }
        IconType::UserRoundPen => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDPEN_ELEMENTS)
        }
        IconType::UserRoundPlus => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDPLUS_ELEMENTS)
        }
        IconType::UserRoundSearch => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDSEARCH_ELEMENTS)
        }
        IconType::UserRoundX => {
            Some(crate::icons::common::icon_registry_elements::USERROUNDX_ELEMENTS)
        }
        IconType::UserSearch => {
            Some(crate::icons::common::icon_registry_elements::USERSEARCH_ELEMENTS)
        }
        IconType::UserStar => Some(crate::icons::common::icon_registry_elements::USERSTAR_ELEMENTS),
        IconType::UserX => Some(crate::icons::common::icon_registry_elements::USERX_ELEMENTS),
        IconType::Users => Some(crate::icons::common::icon_registry_elements::USERS_ELEMENTS),
        IconType::UsersRound => {
            Some(crate::icons::common::icon_registry_elements::USERSROUND_ELEMENTS)
        }
        IconType::Utensils => Some(crate::icons::common::icon_registry_elements::UTENSILS_ELEMENTS),
        IconType::UtensilsCrossed => {
            Some(crate::icons::common::icon_registry_elements::UTENSILSCROSSED_ELEMENTS)
        }
        IconType::UtilityPole => {
            Some(crate::icons::common::icon_registry_elements::UTILITYPOLE_ELEMENTS)
        }
        IconType::Variable => Some(crate::icons::common::icon_registry_elements::VARIABLE_ELEMENTS),
        IconType::Vault => Some(crate::icons::common::icon_registry_elements::VAULT_ELEMENTS),
        IconType::VectorSquare => {
            Some(crate::icons::common::icon_registry_elements::VECTORSQUARE_ELEMENTS)
        }
        IconType::Vegan => Some(crate::icons::common::icon_registry_elements::VEGAN_ELEMENTS),
        IconType::VenetianMask => {
            Some(crate::icons::common::icon_registry_elements::VENETIANMASK_ELEMENTS)
        }
        IconType::Venus => Some(crate::icons::common::icon_registry_elements::VENUS_ELEMENTS),
        IconType::VenusAndMars => {
            Some(crate::icons::common::icon_registry_elements::VENUSANDMARS_ELEMENTS)
        }
        IconType::Vibrate => Some(crate::icons::common::icon_registry_elements::VIBRATE_ELEMENTS),
        IconType::VibrateOff => {
            Some(crate::icons::common::icon_registry_elements::VIBRATEOFF_ELEMENTS)
        }
        IconType::Video => Some(crate::icons::common::icon_registry_elements::VIDEO_ELEMENTS),
        IconType::VideoOff => Some(crate::icons::common::icon_registry_elements::VIDEOOFF_ELEMENTS),
        IconType::Videotape => {
            Some(crate::icons::common::icon_registry_elements::VIDEOTAPE_ELEMENTS)
        }
        IconType::View => Some(crate::icons::common::icon_registry_elements::VIEW_ELEMENTS),
        IconType::Voicemail => {
            Some(crate::icons::common::icon_registry_elements::VOICEMAIL_ELEMENTS)
        }
        IconType::Volleyball => {
            Some(crate::icons::common::icon_registry_elements::VOLLEYBALL_ELEMENTS)
        }
        IconType::Volume => Some(crate::icons::common::icon_registry_elements::VOLUME_ELEMENTS),
        IconType::Volume1 => Some(crate::icons::common::icon_registry_elements::VOLUME1_ELEMENTS),
        IconType::Volume2 => Some(crate::icons::common::icon_registry_elements::VOLUME2_ELEMENTS),
        IconType::VolumeOff => {
            Some(crate::icons::common::icon_registry_elements::VOLUMEOFF_ELEMENTS)
        }
        IconType::VolumeX => Some(crate::icons::common::icon_registry_elements::VOLUMEX_ELEMENTS),
        IconType::Vote => Some(crate::icons::common::icon_registry_elements::VOTE_ELEMENTS),
        IconType::Wallet => Some(crate::icons::common::icon_registry_elements::WALLET_ELEMENTS),
        IconType::WalletCards => {
            Some(crate::icons::common::icon_registry_elements::WALLETCARDS_ELEMENTS)
        }
        IconType::WalletMinimal => {
            Some(crate::icons::common::icon_registry_elements::WALLETMINIMAL_ELEMENTS)
        }
        IconType::Wallpaper => {
            Some(crate::icons::common::icon_registry_elements::WALLPAPER_ELEMENTS)
        }
        IconType::Wand => Some(crate::icons::common::icon_registry_elements::WAND_ELEMENTS),
        IconType::WandSparkles => {
            Some(crate::icons::common::icon_registry_elements::WANDSPARKLES_ELEMENTS)
        }
        IconType::Warehouse => {
            Some(crate::icons::common::icon_registry_elements::WAREHOUSE_ELEMENTS)
        }
        IconType::WashingMachine => {
            Some(crate::icons::common::icon_registry_elements::WASHINGMACHINE_ELEMENTS)
        }
        IconType::Watch => Some(crate::icons::common::icon_registry_elements::WATCH_ELEMENTS),
        IconType::Waves => Some(crate::icons::common::icon_registry_elements::WAVES_ELEMENTS),
        IconType::WavesLadder => {
            Some(crate::icons::common::icon_registry_elements::WAVESLADDER_ELEMENTS)
        }
        IconType::Waypoints => {
            Some(crate::icons::common::icon_registry_elements::WAYPOINTS_ELEMENTS)
        }
        IconType::Webcam => Some(crate::icons::common::icon_registry_elements::WEBCAM_ELEMENTS),
        IconType::Webhook => Some(crate::icons::common::icon_registry_elements::WEBHOOK_ELEMENTS),
        IconType::WebhookOff => {
            Some(crate::icons::common::icon_registry_elements::WEBHOOKOFF_ELEMENTS)
        }
        IconType::Weight => Some(crate::icons::common::icon_registry_elements::WEIGHT_ELEMENTS),
        IconType::Wheat => Some(crate::icons::common::icon_registry_elements::WHEAT_ELEMENTS),
        IconType::WheatOff => Some(crate::icons::common::icon_registry_elements::WHEATOFF_ELEMENTS),
        IconType::WholeWord => {
            Some(crate::icons::common::icon_registry_elements::WHOLEWORD_ELEMENTS)
        }
        IconType::Wifi => Some(crate::icons::common::icon_registry_elements::WIFI_ELEMENTS),
        IconType::WifiCog => Some(crate::icons::common::icon_registry_elements::WIFICOG_ELEMENTS),
        IconType::WifiHigh => Some(crate::icons::common::icon_registry_elements::WIFIHIGH_ELEMENTS),
        IconType::WifiLow => Some(crate::icons::common::icon_registry_elements::WIFILOW_ELEMENTS),
        IconType::WifiOff => Some(crate::icons::common::icon_registry_elements::WIFIOFF_ELEMENTS),
        IconType::WifiPen => Some(crate::icons::common::icon_registry_elements::WIFIPEN_ELEMENTS),
        IconType::WifiSync => Some(crate::icons::common::icon_registry_elements::WIFISYNC_ELEMENTS),
        IconType::WifiZero => Some(crate::icons::common::icon_registry_elements::WIFIZERO_ELEMENTS),
        IconType::Wind => Some(crate::icons::common::icon_registry_elements::WIND_ELEMENTS),
        IconType::WindArrowDown => {
            Some(crate::icons::common::icon_registry_elements::WINDARROWDOWN_ELEMENTS)
        }
        IconType::Wine => Some(crate::icons::common::icon_registry_elements::WINE_ELEMENTS),
        IconType::WineOff => Some(crate::icons::common::icon_registry_elements::WINEOFF_ELEMENTS),
        IconType::Workflow => Some(crate::icons::common::icon_registry_elements::WORKFLOW_ELEMENTS),
        IconType::Worm => Some(crate::icons::common::icon_registry_elements::WORM_ELEMENTS),
        IconType::WrapText => Some(crate::icons::common::icon_registry_elements::WRAPTEXT_ELEMENTS),
        IconType::Wrench => Some(crate::icons::common::icon_registry_elements::WRENCH_ELEMENTS),
        IconType::X => Some(crate::icons::common::icon_registry_elements::X_ELEMENTS),
        IconType::Youtube => Some(crate::icons::common::icon_registry_elements::YOUTUBE_ELEMENTS),
        IconType::Zap => Some(crate::icons::common::icon_registry_elements::ZAP_ELEMENTS),
        IconType::ZapOff => Some(crate::icons::common::icon_registry_elements::ZAPOFF_ELEMENTS),
        IconType::ZoomIn => Some(crate::icons::common::icon_registry_elements::ZOOMIN_ELEMENTS),
        IconType::ZoomOut => Some(crate::icons::common::icon_registry_elements::ZOOMOUT_ELEMENTS),
    }
}
