import { LitElement, html, css } from "lit";
import { DDDSuper  } from "@haxtheweb/d-d-d";
import "./site-card.js";

 //class SiteAnalyzer extends DDDSuper(LitElement) {
 // static get properties() {
  //  return {
    //  url: { type: String },
      //siteData: { type: Array, attribute: "site-data" },
     // items: { type: Array },
      //loading: { type: Boolean },
    //};
 // }
 class SiteAnalyzer extends DDDSuper(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      .input-section {
        display: flex;
        align-items: center;
        background-color: #fdf5f5; 
        border-radius: var(--ddd-radius-sm);
        border: 1px solid #fff;
        width: 95%;
        padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
        margin: 10px auto;
        margin-bottom: 20px;
        gap: 10px;
      }
      //.search-icon {
      //  display: flex;
        //align-items: center;
      //  background-color: #75d9a2; 
     // }
      //.search-input::placeholder {
      //  color: #79267d
      //}
      //.search-input:focus {
      //  outline: none;
     // }
       button { 
        background-color: #3244a9; 
        color: white;
        border: none;
        border-radius: var(--ddd-radius-xs);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-2);
        cursor: pointer;
        margin-right: 8px;
      }

      button:hover {
        background-color: #3999af;
      }

      .results {
        visibility: visible;
        height: 100%;
        opacity: 1;
      }

      details {
        margin: 16px;
        padding: var(--ddd-spacing-1);
      }
      summary {
        font-size: 24px;
        padding: var(--ddd-spacing-1);
        color: white;
      }
      input {
        font-size: 24px;
        line-height: 40px;
        width: 100%;
      }
    `;
  }

  static get properties() {
    return {
      url: { type: String },
      isValid: { type: Boolean, reflect: true },
      placeholder: { type: String },
      siteData: { type: Object },
      items: { type: Array },
    };
  }

  constructor() {
    super();
    this.url = "";
    this.isValid = false;
    this.placeholder = "https://haxtheweb.org/site.json";
    this.siteData = {};
    this.items = [];
  }

  updated(changedProperties) {
    if (changedProperties.has("url")) {
      this.isValid = this.url
    }
  }

  render() {
    return html`
      <h2>Analyze a HAX Site</h2>
      <div class="input-section">
        <input
          type="text"
          .value="${this.url}"
          placeholder="${this.placeholder}"
          @input="${this._updateURL}"
        />
        <button ?disabled="${!this.isValid}" @click="${this.analyzeSite}">
          Analyze Site!
        </button>
      </div>

      <hax-search json-url="${this.url}"></hax-search>

      <!-- Site Overview -->
      ${this.siteData.title
        ? html`
            <div class="overview">
              <h3>Site Overview</h3>
              <p><strong>Name:</strong> ${this.siteData.title}</p>
              <p><strong>Description:</strong> ${this.siteData.description || "N/A"}</p>
              ${this.siteData.logo
                ? html`<img src="${this.siteData.logo}" alt="Site Logo" />`
                : ""}
              <p><strong>Theme:</strong> ${this.siteData.metadata?.theme?.name || "N/A"}</p>
              <p><strong>Created:</strong> ${this.siteData.metadata.site.created || "N/A"}</p>
              <p><strong>Last Updated:</strong> ${this.siteData.updated || "N/A"}</p>
              <p><strong>Hex Code:</strong> ${this.siteData.hexCode || "N/A"}</p>
            </div>
          `
        : ""}
      

      <div class="results">
        ${this.items.map(
          (item) => html`
            <site-card
              title="${item.title || "Untitled"}"
              image="${item.image || ""}"
              description="${item.description || "No description available."}"
              updated="${item.updated || "N/A"}"
              link="${this.url.replace('/site.json', '')}/${item.slug}"
              sourceLink="${item.slug}/index.html"
            ></site-card>
          `
        )}
      </div>
    `;
  }

  _updateURL(event) {
    this.url = event.target.value.trim();
  }

  async analyzeSite() {
    if (!this.url) {
      alert("Please enter a valid URL");
      return;
    }

    // Ensure URL ends with site.json
    if (!this.url.endsWith('site.json')) {
      this.url = this.url.endsWith('/') ? 
        `${this.url}site.json` : 
        `${this.url}/site.json`;
    }

    try {
      this.loading = true;
      const response = await fetch(this.url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate schema
      if (!data.metadata || !data.items || !Array.isArray(data.items)) {
        throw new Error("Invalid site.json schema - missing required fields");
      }

      // Update component state
      this.siteData = data.metadata;
      this.items = data.items;
      this.loading = false;
    } catch (error) {
      console.error("Error processing site:", error);
      alert(`Error: ${error.message}`);
      this.siteData = {};
      this.items = [];
    } finally {
      this.loading = false;
    }
  }

  static get tag() {
    return "site-analyzer";
  }
}

customElements.define(SiteAnalyzer.tag, SiteAnalyzer);

