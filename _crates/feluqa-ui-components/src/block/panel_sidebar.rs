use crate::component::sidenav::{
    Sidenav, SidenavCollapsible, SidenavSide, SidenavVariant, SidenavWrapper,
};
use crate::runtime::prelude::*;

/// Shared responsive shell for Feluqa panel sidebars.
///
/// Supply a custom `sidebar` view to compose the same framework behavior with
/// platform, application, module, or product navigation.
#[component]
pub fn PanelSidebar(
    sidebar: AnyView,
    children: Children,
    #[prop(optional, into)] class: String,
    #[prop(default = true)] default_open: bool,
    #[prop(default = SidenavVariant::default())] variant: SidenavVariant,
    #[prop(default = SidenavSide::default())] side: SidenavSide,
    #[prop(default = SidenavCollapsible::default())] collapsible: SidenavCollapsible,
) -> impl IntoView {
    view! {
        <SidenavWrapper class=class default_open=default_open>
            <Sidenav variant=variant data_side=side data_collapsible=collapsible>
                {sidebar}
            </Sidenav>
            <main class="min-w-0 flex-1">{children()}</main>
        </SidenavWrapper>
    }
}
