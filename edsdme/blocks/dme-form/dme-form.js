async function resolvePlaceholderFromProfile(placeholder) {
  const placeholderPattern = /\$\{profile\.(.+?)\}/;

  if (!placeholderPattern.test(placeholder)) {
    return '';
  }

  if (window.adobeIMS) {
    window.adobeIMS.initialize();
  }

  const maxRetries = 10;
  const interval = 500;
  let isSignedIn = false;
  let attempts = 0;

  const wait = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  while (attempts < maxRetries) {
    const ims = window.adobeIMS;
    const hasMethod = ims && typeof ims.isSignedInUser === 'function';

    if (hasMethod) {
      // eslint-disable-next-line no-await-in-loop
      const signedIn = await ims.isSignedInUser();
      if (signedIn) {
        isSignedIn = true;
        break;
      }
    }

    // eslint-disable-next-line no-await-in-loop
    await wait(interval);
    attempts += 1;
  }

  if (!isSignedIn) {
    // eslint-disable-next-line no-console
    console.warn('User not signed in or IMS not ready');
    return '';
  }

  const profile = await window.adobeIMS.getProfile();

  if (!profile) {
    // eslint-disable-next-line no-console
    console.warn('Failed to retrieve profile');
    return '';
  }

  return placeholder.replace(/\$\{profile\.(.+?)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(profile, key)) {
      return profile[key];
    }
    return '';
  });
}

function createInput(fd) {
  const input = document.createElement('input');
  input.type = fd.Type;
  input.id = fd.Field;

  input.setAttribute('placeholder', !fd.Placeholder.includes('${') ? fd.Placeholder : '');

  if (fd.Mandatory.trim() === 'x') {
    input.classList.add('mandatory');
  }

  return input;
}

function createErrorBlock(fd) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('error-wrapper');
  const error = document.createElement('div');
  error.classList.add('error-message');

  if (fd.Mandatory.trim() === 'x') {
    error.textContent = `${fd.Label} cannot be blank.`;
  }
  wrapper.append(error);
  return wrapper;
}

function createSelect(fd) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('select-wrapper');
  const select = document.createElement('select');
  select.id = fd.Field;
  if (fd.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = fd.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    select.append(ph);
  }
  Object.keys(fd).filter((o) => o.indexOf('Option-') === 0).forEach((key) => {
    const value = fd[key];
    if (!value) {
      return;
    }
    const option = document.createElement('option');
    option.textContent = value.trim();
    option.value = value.trim();
    select.append(option);
  });
  if (fd.OtherOption) {
    const option = document.createElement('option');
    option.textContent = fd.OtherOption;
    option.value = 'other';
    select.append(option);

    select.addEventListener('change', (e) => {
      if (e.target.value === 'other') {
        const otherFd = { Field: `${select.id}-other-text`, Placeholder: 'Enter your answer', Type: 'text' };
        const other = createInput(otherFd);
        other.classList.add('select-other-input');
        other.setAttribute('data-other', '');
        document.querySelector(`#${select.id}`).insertAdjacentElement('afterend', other);
        const br = document.createElement('br');
        other.insertAdjacentElement('beforebegin', br);
        if (fd.Mandatory.trim() === 'x') {
          other.classList.add('mandatory');
        }
      } else {
        const otherText = document.querySelector(`#${select.id}-other-text`);
        if (otherText) {
          otherText.remove();
        }
      }
    });
  }

  if (fd.Mandatory.trim() === 'x') {
    select.classList.add('mandatory');
  }
  wrapper.append(select);
  return wrapper;
}

function createRadio(fd) {
  const group = document.createElement('div');
  group.classList.add('radio-group');
  Object.keys(fd).filter((o) => o.indexOf('Option-') === 0).forEach((key, idx) => {
    const value = fd[key];
    if (!value) {
      return;
    }

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = `${fd.Field}-${idx}`;
    radio.name = fd.Field;
    radio.value = value.trim();
    if (fd.Mandatory.trim() === 'x' && idx === 0) {
      radio.classList.add('mandatory');
    }
    group.append(radio);

    const label = document.createElement('label');
    label.classList.add('radio-label');
    label.setAttribute('for', `${fd.Field}-${idx}`);
    label.textContent = value.trim();
    group.append(label);

    const br = document.createElement('br');
    group.append(br);
  });
  if (fd.OtherOption) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = `${fd.Field}-other`;
    radio.name = fd.Field;
    radio.value = 'other';
    group.append(radio);

    const other = createInput({ Field: `${radio.id}-text`, Placeholder: fd.OtherOption, Type: 'text' });
    other.classList.add('radio-other-input');
    other.setAttribute('data-other', '');
    if (fd.Mandatory.trim() === 'x') {
      other.classList.add('mandatory');
    }
    group.append(other);
  }
  return group;
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type.trim() === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.type.trim() === 'radio') {
      if (Object.prototype.hasOwnProperty.call(payload, fe.name)) {
        return;
      }
      const checkedOption = form.querySelector(`input[name='${fe.name}']:checked`);
      let value = checkedOption ? checkedOption.value : '';
      if (value === 'other') {
        value = form.querySelector(`#${fe.name}-other-text`).value;
      }
      payload[fe.name] = value;
    } else if (fe.type.trim() === 'select-one') {
      payload[fe.id] = fe.value;
      const placeholder = fe.firstElementChild;
      if (placeholder.textContent === fe.value) {
        payload[fe.id] = '';
      } else if (fe.value.trim() === 'other') {
        payload[fe.id] = form.querySelector(`#${fe.id}-other-text`).value;
      }
    } else if (fe.id && !fe.hasAttribute('data-other')) {
      payload[fe.id] = fe.value;
    }
  });
  return payload;
}

function validate(form, submit, e) {
  let valid = true;
  const payload = constructPayload(form);
  [...form.elements].forEach((fe) => {
    if (!submit && e.target.id !== fe.id) {
      return;
    }
    if (!fe.classList.contains('mandatory')) {
      return;
    }
    let value = '';
    if (fe.type.trim() === 'text' || fe.type.trim() === 'email') {
      if (fe.id.indexOf('-other-text') !== -1) {
        const id = fe.id.split('-other-text')[0];
        value = payload[id];
      } else {
        value = payload[fe.id];
      }
    } else if (fe.type.trim() === 'radio') {
      value = payload[fe.name];
    } else if (fe.type.trim() === 'select-one') {
      value = payload[fe.id];
    }

    if (!value) {
      fe.closest('.row').classList.add('error');
      valid = false;
    } else {
      fe.closest('.row').classList.remove('error');
    }
  });
  return valid;
}

function createDisclaimer(disclaimer) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('disclaimer');
  wrapper.innerHTML = disclaimer;
  return wrapper;
}

async function submitForm(form) {
  const payload = constructPayload(form);
  payload.timestamp = new Date().toJSON();
  const constructSubmitUrl = (formDefinitionUrl) => {
    try {
      const url = new URL(formDefinitionUrl);
      const id = window.btoa(url.pathname);
      return `https://forms.adobe.com/adobe/forms/af/submit/${id}`;
    } catch (error) {
      return null;
    }
  };

  const resp = await fetch(constructSubmitUrl(form.dataset.action), {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'x-adobe-form-hostname': 'main--dme-partners--adobecom.aem.page',
    },
    body: JSON.stringify({ data: payload }),
  }).catch(() => false);
  if (!resp.ok) {
    return false;
  }
  await resp.text();
  return payload;
}

function createSubmitError() {
  const msg = document.createElement('p');
  msg.classList.add('submit-error');
  msg.textContent = 'Unable to receive your data.';
  const submitWrapper = document.querySelector('.form-submit-wrapper');
  submitWrapper.insertBefore(msg, submitWrapper.lastChild);
}

async function submitHandler(event, button, fd, thankYouPageURL) {
  const form = button.closest('form');
  if (fd.Placeholder) form.dataset.action = fd.Placeholder;
  if (validate(form, true)) {
    event.preventDefault();
    button.setAttribute('disabled', '');
    const result = await submitForm(form);

    if (result) {
      if (thankYouPageURL) {
        window.location.assign(thankYouPageURL);
      }
    } else {
      createSubmitError();
    }
  }
}

function createButton(fd, thankYouPageURL) {
  const button = document.createElement('button');
  button.textContent = fd.Label;
  button.classList.add('spectrum-Button', 'spectrum-Button--cta');
  if (fd.Type.trim() === 'submit') {
    button.addEventListener('click', (event) => submitHandler(event, button, fd, thankYouPageURL));
  }
  return button;
}

function createHeading(fd, el) {
  const heading = document.createElement(el);
  heading.textContent = fd.Label;
  return heading;
}

function createTextArea(fd) {
  const input = document.createElement('textarea');
  input.id = fd.Field;
  input.setAttribute('placeholder', fd.Placeholder);
  if (fd.Mandatory.trim() === 'x') {
    input.classList.add('mandatory');
  }
  return input;
}

function createLabel(fd) {
  const label = document.createElement('label');
  label.setAttribute('for', fd.Field);
  label.textContent = fd.Label;
  if (fd.Mandatory.trim() === 'x') {
    label.classList.add('required');
  }
  if (fd.Type.trim() === 'checkbox') {
    label.classList.add('checkbox-label');
  }
  return label;
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') {
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`#${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`#${field.fieldId}`).classList.add('hidden');
        }
      }
    }
  });
}

function applyBranching(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((rule) => {
    if (!rule.condition) {
      return;
    }
    const [field, value] = rule.condition.split('=');
    if (!field || !value) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid render condition: ${field}=${value}`);
      return;
    }
    if (payload[field] === value) {
      form.querySelector(`#${rule.fieldId}`).classList.remove('hidden');
    } else {
      form.querySelector(`#${rule.fieldId}`).classList.add('hidden');
    }
  });
}

function fill(form) {
  const { action } = form.dataset;
  if (action === '/tools/bot/register-form') {
    const loc = new URL(window.location.href);
    form.querySelector('#owner').value = loc.searchParams.get('owner') || '';
    form.querySelector('#installationId').value = loc.searchParams.get('id') || '';
  }
}

async function createForm(formURL, submitURL, disclaimer, thankYouPageURL) {
  const { href } = new URL(formURL);
  const resp = await fetch(href);
  const json = await resp.json();
  const form = document.createElement('form');
  const rules = [];
  const branching = [];
  form.dataset.action = submitURL;
  json.data.forEach(async (fd, idx) => {
    fd.Type = fd.Type.trim() || 'text';
    const fieldWrapper = document.createElement('div');
    const style = fd.Style ? ` form-${fd.Style}` : '';
    const fieldId = `form-${fd.Type}-wrapper${style}`;
    fieldWrapper.className = fieldId;
    fieldWrapper.id = `${fieldId}-${idx}`;
    fieldWrapper.classList.add('field-wrapper', 'row');
    switch (fd.Type.trim()) {
      case 'select':
        fieldWrapper.classList.add('dropdownlist');
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        fieldWrapper.append(createErrorBlock(fd));
        break;
      case 'radio':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createRadio(fd));
        break;
      case 'heading':
        fieldWrapper.append(createHeading(fd, 'h3'));
        break;
      case 'legal':
        fieldWrapper.append(createHeading(fd, 'p'));
        break;
      case 'checkbox':
        fieldWrapper.classList.add('checkbox');
        fieldWrapper.append(createInput(fd));
        fieldWrapper.append(createLabel(fd));
        break;
      case 'text-area':
        fieldWrapper.classList.add('textarea');
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createTextArea(fd));
        break;
      case 'submit':
        fieldWrapper.classList.add('submit');
        if (disclaimer) {
          fieldWrapper.append(createDisclaimer(disclaimer));
        }
        fieldWrapper.append(createButton(fd, thankYouPageURL));
        break;
      default: {
        const input = createInput(fd);

        fieldWrapper.classList.add('textfield');
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(input);
        fieldWrapper.append(createErrorBlock(fd));

        if (fd.Placeholder.trim()) {
          resolvePlaceholderFromProfile(fd.Placeholder.trim()).then((resolved) => {
            if (resolved) {
              input.setAttribute('placeholder', resolved);
              input.value = resolved;
            }
          });
        }
        break;
      }
    }

    if (fd.Rules) {
      try {
        rules.push({ fieldId: fieldWrapper.id, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
    if (fd.RenderCondition) {
      branching.push({ fieldId: fieldWrapper.id, condition: fd.RenderCondition });
    }
    form.append(fieldWrapper);
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);
  form.addEventListener('change', (e) => {
    applyBranching(form, branching);
    validate(form, false, e);
  });
  applyBranching(form, branching);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  fill(form);
  return (form);
}

export default async function init(el) {
  const form = el.querySelector('a[href$="form-definition.json"]');
  let thankYouPageURL = '';
  let actionURL = '';

  el.querySelectorAll('div').forEach((div) => {
    const elementContent = div.textContent.toLowerCase();

    if (elementContent.includes('form-action.json')) {
      const domain = window.location.origin;
      actionURL = domain + div.textContent;
      div.remove();
    }

    if (elementContent.includes('thank-you-page')) {
      const parent = div.parentElement;
      thankYouPageURL = parent.querySelector('a').href;
    }

    if (elementContent.trim() === 'form-definition' || elementContent.trim() === 'form-action' || elementContent.trim() === 'thank-you-page') {
      div.remove();
    }
  });

  if (form && actionURL) {
    createForm(
      form.href,
      actionURL,
      form.dataset.disclaimer,
      thankYouPageURL,
    ).then((result) => {
      form.replaceWith(result);
    });
  }

  return el;
}
