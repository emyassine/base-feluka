#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;

use crate::axum::extract::OriginalUri;
use feluqa::auth::{PermissionSetAuthorizer, Principal};
use feluqa::panel::{PanelCatalog, PanelError, PanelRenderError};
use feluqa::prelude::*;

/// Render a registered panel page after the route group's session guard runs.
pub(crate) async fn registered(
    Extension(catalog): Extension<PanelCatalog>,
    Extension(principal): Extension<Principal>,
    OriginalUri(uri): OriginalUri,
) -> Response {
    match catalog.render_page(uri.path(), &principal, &PermissionSetAuthorizer) {
        Ok(html) => Html(String::from(html.as_str())).into_response(),
        Err(PanelRenderError::Access(PanelError::Forbidden)) => {
            StatusCode::FORBIDDEN.into_response()
        }
        Err(PanelRenderError::Access(PanelError::NotFound(_))) => {
            StatusCode::NOT_FOUND.into_response()
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
}
