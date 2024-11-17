/**
 * Copyright 2024 ashniv05
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `project-1`
 * 
 * @demo index.html
 * @element project-1
 */
export class project1 extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "project-1";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/project-1.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });

    // Initialize properties for site data and input URL
    this.url = "";
    this.metadata = {};
    this.items = [];
    this.loading = false;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      url: { type: String },
      metadata: { type: Object },
      items: { type: Array },
      loading: { type: Boolean, reflect: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--project-1-label-font-size, var(--ddd-font-size-s));
      }
      .input-section {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }
      input[type="text"] {
        flex-grow: 1;
        padding: 8px;
      }
      button {
        padding: 8px 16px;
        cursor: pointer;
      }
      .overview {
        border: 1px solid #ddd;
        padding: 16px;
        margin-bottom: 20px;
      }
      .overview img {
        max-width: 100px;
        margin-top: 10px;
      }
      .results {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }
      .card {
        border: 1px solid #ddd;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 240px;
      }
      .card img {
        width: 100%;
        max-width: 200px;
        height: auto;
      }
      .card h3 {
        margin: 10px 0;
        font-size: 18px;
      }
      .card p {
        font-size: 14px;
        color: #666;
      }
      .card a {
        text-decoration: none;
        color: #007acc;
        font-weight: bold;
        margin-top: 5px;
      }
      .card a:hover {
        color: #005b99;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <h3><span>${this.t.title}:</span> ${this.title}</h3>
        
        <!-- Input section for the site URL -->
        <div class="input-section">
          <input id="input" placeholder="Enter site URL (e.g., https://haxtheweb.org)" @input="${this.inputChanged}" />
          <button @click="${this.analyzeSite}">Analyze Site!</button>
        </div>

        <!-- Overview section -->
        ${Object.keys(this.metadata).length > 0 ? html`
          <div class="overview">
            <h3>Site Overview</h3>
            <p><strong>Name:</strong> ${this.sitedata.title || 'N/A'}</p>
            <p><strong>Description:</strong> ${this.sitedata.description || 'N/A'}</p>
            ${this.metadata.logo ? html`<img src="${this.sitedata.metadata.site.logo}" alt="Site Logo" />` : ''}
            <p><strong>Theme:</strong> ${this.sitedata.metadata.theme || 'N/A'}</p>
            <p><strong>Created:</strong> ${this.sitedata.metadata.site.created || 'N/A'}</p>
            <p><strong>Last Updated:</strong> ${this.sitedata.metadata.site.updated || 'N/A'}</p>
            <p><strong>Hex Code:</strong> ${this.sitedata.metadata.theme.hexCode || 'N/A'}</p>
            <p><strong>Icon:</strong> ${this.sitedata.metadata.theme.icon || 'N/A'}</p>
          </div>
        ` : ''}

        <!-- Results section for items -->
        <div class="results">
          ${this.items.map(item => html`
            <div class="card">
              ${item.image ? html`<img src="${item.image}" alt="Page image">` : ''}
              <h3>${item.title || 'Untitled'}</h3>
              <p><strong>Last updated:</strong> ${item.updated || 'N/A'}</p>
              <p>${item.description || 'No description available.'}</p>
              <a href="${item.slug}" target="_blank">Open in new window</a>
              <a href="${item.slug}/index.html" target="_blank">Open source</a>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  inputChanged(e) {
    this.url = this.shadowRoot.querySelector('#input').value;
  }

  async analyzeSite() {
    if (!this.url) {
      alert("Please enter a URL.");
      return;
    }

    const siteUrl = this.url.endsWith("site.json") ? this.url : `${this.url}/site.json`;

    this.loading = true;
    try {
      const response = await fetch(siteUrl);
      const data = await response.json();
      console.log("Fetched data:", data); // Debug log
      if (!data.metadata || !data.items) {
        throw new Error("Invalid site.json structure");
      }
      this.metadata = data.metadata;
      this.items = data.items;

      const iconElement = this.shadowRoot.querySelector('.icon');
      if (iconElement && this.metadata.theme.icon) {
        iconElement.setAttribute('icon', this.metadata.theme.icon);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching site.json: " + error.message);
    } finally {
      this.loading = false;
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(project1.tag, project1);
