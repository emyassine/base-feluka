#![no_implicit_prelude]

use super::*;
use crate::feluqa::ui::component::card::{
    Card, CardContent, CardDescription, CardHeader, CardTitle,
};
use crate::feluqa::ui::prelude::{IntoView, Owner, RenderHtml};
use crate::feluqa::view::TrustedHtml;
use crate::std::string::String;
use crate::std::string::ToString;

pub(crate) fn with_modules_component_card(
    table: TrustedHtml,
    total_modules: usize,
    active_modules: usize,
) -> TrustedHtml {
    let owner = Owner::default();
    let summary = owner.with(|| {
        crate::feluqa::ui::view! {
            <Card>
                <CardHeader>
                    <CardTitle>"Compiled modules"</CardTitle>
                    <CardDescription>
                        {total_modules.to_string()}
                        " modules are compiled into this product; "
                        {active_modules.to_string()}
                        " are currently active."
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>"Module installation is currently determined by the product build."</p>
                </CardContent>
            </Card>
        }
        .into_view()
        .to_html()
    });
    let mut html = String::with_capacity(summary.len() + table.as_str().len());
    html.push_str(&summary);
    html.push_str(table.as_str());
    TrustedHtml::from_trusted(html)
}
