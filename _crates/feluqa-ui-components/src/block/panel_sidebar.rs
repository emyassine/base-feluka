use crate::component::sidenav::{
    Sidenav, SidenavCollapsible, SidenavContent, SidenavGroup, SidenavGroupLabel, SidenavHeader,
    SidenavMenu, SidenavMenuButton, SidenavMenuItem, SidenavSide, SidenavVariant, SidenavWrapper,
};
use crate::runtime::prelude::Owner;
use crate::runtime::prelude::*;
use crate::runtime::view;
use crate::std::clone::Clone;
use crate::std::convert::{From, Into};
use crate::std::default::Default;
use crate::std::iter::{IntoIterator, Iterator};
use crate::std::option::Option;
use crate::std::string::String;
use crate::std::vec::Vec;

/// A navigation destination rendered by Feluqa's shared panel sidebar.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PanelNavigationItem {
    /// Visible destination label.
    pub label: String,
    /// Absolute destination path.
    pub path: String,
    /// Optional stable icon identifier from Feluqa Imagery.
    pub icon: Option<String>,
}

/// A labeled set of destinations for one panel sidebar group.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PanelNavigationGroup {
    /// Optional visible group label.
    pub label: Option<String>,
    /// Ordered destinations in the group.
    pub items: Vec<PanelNavigationItem>,
}

/// Render authorized panel navigation with the first-party sidebar components.
pub fn render_panel_navigation(groups: Vec<PanelNavigationGroup>, active_path: String) -> String {
    let owner = Owner::new();
    owner.with(move || {
        view! {
            <SidenavWrapper default_open=true class="feluqa-panel-sidenav-wrapper">
                <Sidenav
                    data_collapsible=SidenavCollapsible::None
                    data_side=SidenavSide::Left
                    variant=SidenavVariant::default()
                    class="feluqa-panel-sidenav"
                >
                    <SidenavHeader>
                        <div class="feluqa-panel-sidenav-brand">"Feluqa"</div>
                    </SidenavHeader>
                    <SidenavContent>
                        {groups.into_iter().map(|group| {
                            let active_path = active_path.clone();
                            let items = group.items.into_iter().map(|item| {
                                let current = if item.path == active_path { "page" } else { "false" };
                                let icon = item.icon.as_deref().and_then(crate::feluqa_imagery::panel_heroicon).map(String::from);
                                view! {
                                    <SidenavMenuItem>
                                        <SidenavMenuButton href=item.path attr:aria-current=current>
                                            {icon.map(|svg| view! { <span class="feluqa-panel-sidenav-icon" inner_html=svg></span> }.into_any()).unwrap_or_else(|| ().into_any())}
                                            <span>{item.label}</span>
                                        </SidenavMenuButton>
                                    </SidenavMenuItem>
                                }.into_any()
                            }).collect_view();
                            let label = group.label.unwrap_or_else(String::new);
                            view! {
                                <SidenavGroup>
                                    <SidenavGroupLabel>{label}</SidenavGroupLabel>
                                    <SidenavMenu>{items}</SidenavMenu>
                                </SidenavGroup>
                            }.into_any()
                        }).collect_view()}
                    </SidenavContent>
                </Sidenav>
            </SidenavWrapper>
        }
        .to_html()
    })
}

/// Shared responsive shell for Feluqa panel sidebars.
///
/// Supply a custom `sidebar` view to compose the same framework behavior with
/// platform, application, module, or product navigation.
#[component]
pub fn PanelSidebar(
    /// Sidebar navigation content.
    sidebar: AnyView,
    /// Main panel content shown beside the sidebar.
    children: Children,
    /// Additional wrapper classes.
    #[prop(optional, into)] class: String,
    /// Whether the sidebar starts expanded.
    #[prop(default = true)] default_open: bool,
    /// Visual frame for the sidebar.
    #[prop(default = SidenavVariant::default())] variant: SidenavVariant,
    /// Which side of the page contains the sidebar.
    #[prop(default = SidenavSide::default())] side: SidenavSide,
    /// How the sidebar collapses on smaller screens.
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
