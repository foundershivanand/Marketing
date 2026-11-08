export interface DiscoveredField {
  name: string;
  type: string;
  label?: string;
  required: boolean;
  placeholder?: string;
}

export interface DiscoveredForm {
  action: string;
  method: string;
  fields: DiscoveredField[];
  submitButtonText?: string;
}

export class FormDiscoveryService {
  extractFormsFromHtml(html: string): DiscoveredForm[] {
    const forms: DiscoveredForm[] = [];
    const formRegex = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;

    let match;
    while ((match = formRegex.exec(html)) !== null) {
      const formAttrs = match[1];
      const formContent = match[2];

      const actionMatch = formAttrs.match(/action=["']([^"']*)["']/i);
      const methodMatch = formAttrs.match(/method=["']([^"']*)["']/i);

      const action = actionMatch ? actionMatch[1] : '';
      const method = methodMatch ? methodMatch[1].toUpperCase() : 'POST';

      const fields: DiscoveredField[] = [];
      const inputRegex = /<input\b([^>]*)>/gi;
      let inputMatch;
      while ((inputMatch = inputRegex.exec(formContent)) !== null) {
        const attrs = inputMatch[1];
        const nameMatch = attrs.match(/name=["']([^"']*)["']/i);
        const typeMatch = attrs.match(/type=["']([^"']*)["']/i);
        const reqMatch = attrs.match(/\brequired\b/i);
        const placeMatch = attrs.match(/placeholder=["']([^"']*)["']/i);

        if (nameMatch) {
          fields.push({
            name: nameMatch[1],
            type: typeMatch ? typeMatch[1] : 'text',
            required: !!reqMatch,
            placeholder: placeMatch ? placeMatch[1] : undefined,
          });
        }
      }

      // Check textareas
      const textareaRegex = /<textarea\b([^>]*)>/gi;
      let textMatch;
      while ((textMatch = textareaRegex.exec(formContent)) !== null) {
        const attrs = textMatch[1];
        const nameMatch = attrs.match(/name=["']([^"']*)["']/i);
        const reqMatch = attrs.match(/\brequired\b/i);

        if (nameMatch) {
          fields.push({
            name: nameMatch[1],
            type: 'textarea',
            required: !!reqMatch,
          });
        }
      }

      forms.push({ action, method, fields });
    }

    return forms;
  }
}
