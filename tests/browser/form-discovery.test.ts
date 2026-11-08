import { describe, it, expect } from 'vitest';
import { FormDiscoveryService } from '../../src/browser/form-discovery';

describe('Form Discovery Service', () => {
  const service = new FormDiscoveryService();

  it('extracts input fields, textareas, and attributes from HTML', () => {
    const sampleHtml = `
      <html>
        <body>
          <form action="/submit-startup" method="POST">
            <label>Startup Name</label>
            <input type="text" name="startup_name" placeholder="Acme Inc" required />

            <label>Website URL</label>
            <input type="url" name="website" placeholder="https://..." required />

            <label>Pitch</label>
            <textarea name="description" placeholder="Brief pitch..." required></textarea>

            <button type="submit">Submit Product</button>
          </form>
        </body>
      </html>
    `;

    const forms = service.extractFormsFromHtml(sampleHtml);
    expect(forms.length).toBe(1);

    const form = forms[0];
    expect(form.action).toBe('/submit-startup');
    expect(form.method).toBe('POST');
    expect(form.fields.length).toBe(3);

    const nameField = form.fields.find(f => f.name === 'startup_name');
    expect(nameField?.required).toBe(true);
    expect(nameField?.type).toBe('text');

    const descField = form.fields.find(f => f.name === 'description');
    expect(descField?.type).toBe('textarea');
    expect(descField?.required).toBe(true);
  });

  it('handles HTML pages without forms', () => {
    const html = `<div><h1>No forms here</h1></div>`;
    const forms = service.extractFormsFromHtml(html);
    expect(forms.length).toBe(0);
  });
});
