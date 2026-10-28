#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! First-party subcomponents for card composition.

extern crate feluqa_ui_component_macros;
extern crate feluqa_ui_runtime;
extern crate std;

use crate::std::clone::Clone;
use crate::std::convert::Into;
use crate::std::string::{String, ToString};
use crate::feluqa_ui_component_macros::clx;
use crate::feluqa_ui_runtime::prelude::*;

clx! {CardHeader, div, "@container/card-header flex flex-col items-start gap-1.5 px-6 [[data-size=sm]_&]:px-4 [.border-b]:pb-6 sm:grid sm:auto-rows-min sm:grid-rows-[auto_auto] has-data-[slot=card-action]:sm:grid-cols-[1fr_auto]"}
clx! {CardTitle, h2, "leading-none font-semibold"}
clx! {CardContent, div, "px-6 [[data-size=sm]_&]:px-4"}
clx! {CardDescription, p, "text-muted-foreground text-sm"}
clx! {CardFooter, footer, "flex items-center px-6 [[data-size=sm]_&]:px-4 [.border-t]:pt-6", "gap-2"}
clx! {CardAction, div, "self-start sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-self-end"}
clx! {CardList, ul, "flex flex-col gap-4"}
clx! {CardItem, li, "flex items-center [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"}
