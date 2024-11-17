import { LitElement, html, css } from "lit";
import { DDDSuper  } from "@haxtheweb/d-d-d";
import "./site-card.js";

export class HaxSearch extends LitElement {
  constructor() {
    super();
    this.title = '';
    this.loading = false;
    this.items = [ ];
    this.value = '';
    this.jsonURL = 'https://haxtheweb.org/site.json';
  }

  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      value: { type: String },
      jsonURL: {type: String, attribute: 'json-url'},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([loading]) .results {
        opacity: 0.1;
        visibility: hidden;
        height: 1px;
      }

      .results {
        visibility: visible;
        height: 100%;
        opacity: 1;
      }

      details {
        margin: 16px;
        padding: 16px;
        background-color: var(--global-hex-color, #7c69b9);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      summary {
        font-size: 24px;
        padding: 8px;
        color: white;
      }

      input {
        font-size: 20px;
        line-height: 40px;
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }

      input:focus {
        outline: none;
        border-color: #007acc;
        box-shadow: 0 0 5px rgba(0, 122, 204, 0.5);
      }

      button {
        padding: 8px 16px;
        font-size: 16px;
        color: white;
        background-color: #007acc;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 8px;
      }

      button:hover {
        background-color: #005b99;
      }

      .card {
        margin: 16px;
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .card h3 {
        margin: 0 0 8px;
        font-size: 18px;
      }

      .card p {
        font-size: 14px;
        color: #666;
      }

      .card a {
        color: #007acc;
        text-decoration: none;
        font-weight: bold;
      }

      .card a:hover {
        text-decoration: underline;
      }
    `;
  }

  constructor() {
    super();
    this.title = "HAX Search";
    this.loading = false;
    this.items = [];
    this.value = "";
    this.url = "";
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <details open>
        <summary>Search Input</summary>
        <div>
          <input
            id="input"
            placeholder="Enter HAX site URL"
            @input="${this.inputChanged}"
          />
          <button @click="${this.searchSite}">Search</button>
        </div>
      </details>
      <div class="results">
        ${this.items.map((item) => html`
            <div class="card">
              <h3>${item.title || "Untitled"} </h3>
              <p>${item.description || "No description available."}</p>
              ${item.slug
                ? html`<a href="${this.url}/${item.slug}" target="_blank">View Page</a>`
                : ""}
            </div>
          `
        )}
      </div>
    `;
  }

  inputChanged(e) {
    this.value = e.target.value;
  }

  async searchSite() {
    if (!this.value) {
      alert("Please enter a URL.");
      return;
    }

    const url = this.value.endsWith("site.json")
      ? this.value
      : `${this.value}/site.json`;

    this.loading = true;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch site.json");

      const data = await response.json();
      if (!data || !data.items) {
        alert("Invalid site.json schema.");
        this.loading = false;
        return;
      }

      this.items = data.items;
    } catch (error) {
      console.error("Error fetching site.json:", error);
      alert("Error fetching site.json. Please check the URL.");
    } finally {
      this.loading = false;
    }
  }

  static get tag() {
    return "hax-search";
  }
}

customElements.define(HaxSearch.tag, HaxSearch);

