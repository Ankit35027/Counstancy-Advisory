import { serviceCategories, type ServiceCategory } from "./data/services";

const siteName = "Mittal's Consultancy & Advisory";
const defaultDescription =
  "Mittal's Consultancy & Advisory provides ITR filing, GST compliance, income tax notice, NRI tax, TDS, business registration, and capital gains advisory support.";

function getSiteOrigin() {
  const configuredUrl = import.meta.env.VITE_SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  return window.location.origin;
}

function ensureMeta(name: string, attr: "name" | "property" = "name") {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }

  return element;
}

function ensureLink(rel: string) {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  return element;
}

function setJsonLd(id: string, data: unknown) {
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

function getServiceSchema(service: ServiceCategory, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url,
    provider: {
      "@type": "ProfessionalService",
      name: siteName,
      url: getSiteOrigin(),
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    audience: service.audience,
  };
}

function getHomeSchema() {
  const origin = getSiteOrigin();

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteName,
    url: origin,
    description: defaultDescription,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: serviceCategories.map((service) => service.title),
  };
}

export function updateSeoMetadata(activeService: ServiceCategory | null, isAdminRoute: boolean) {
  const origin = getSiteOrigin();
  const path = activeService ? `/services/${activeService.id}` : "/";
  const canonicalUrl = `${origin}${path}`;
  const title = activeService
    ? `${activeService.title} | ${siteName}`
    : `${siteName} | Tax, GST, Compliance & Advisory Services`;
  const description = activeService ? activeService.summary : defaultDescription;

  document.title = title;
  ensureMeta("description").content = description;
  ensureMeta("robots").content = isAdminRoute ? "noindex, nofollow" : "index, follow";
  ensureMeta("og:title", "property").content = title;
  ensureMeta("og:description", "property").content = description;
  ensureMeta("og:type", "property").content = activeService ? "article" : "website";
  ensureMeta("og:url", "property").content = canonicalUrl;
  ensureMeta("og:site_name", "property").content = siteName;
  ensureMeta("twitter:card").content = "summary";
  ensureMeta("twitter:title").content = title;
  ensureMeta("twitter:description").content = description;
  ensureLink("canonical").href = canonicalUrl;

  if (!isAdminRoute) {
    setJsonLd(
      "structured-data",
      activeService ? getServiceSchema(activeService, canonicalUrl) : getHomeSchema(),
    );
  }
}
