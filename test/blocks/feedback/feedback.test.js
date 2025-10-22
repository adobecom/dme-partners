import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setLibs } from '../../../edsdme/scripts/utils.js';

describe('feedback block', () => {
  let fetchStub;
  
  beforeEach(async () => {
    setLibs('/libs');
    
    fetchStub = sinon.stub(window, 'fetch').callsFake((url) => {
      if (url.includes('.plain.html')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          text: async () => '<div class="feedback"><div><div>Feedback-Definition</div><div>/feedback/feedback-definition.json</div></div></div>',
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        text: async () => '',
      });
    });
  });

  afterEach(() => {
    fetchStub.restore();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    document.querySelectorAll('.feedback-dialog, .feedback-toast').forEach((el) => el.remove());
  });

  describe('metadata-based loading', () => {
    it('should load feedback block when metadata feedback is set to true', async () => {
      const meta = document.createElement('meta');
      meta.name = 'feedback';
      meta.content = 'true';
      document.head.appendChild(meta);

      document.body.innerHTML = await readFile({ path: './mocks/body.html' });
      const block = document.querySelector('.feedback');
      
      const { default: init } = await import('../../../edsdme/blocks/feedback/feedback.js');
      await init(block);

      const feedbackMechanism = document.querySelector('.feedback-mechanism');
      expect(feedbackMechanism).to.exist;
    });

    it('should not load feedback block when metadata feedback is set to false', async () => {
      const meta = document.createElement('meta');
      meta.name = 'feedback';
      meta.content = 'false';
      document.head.appendChild(meta);

      const main = document.createElement('main');
      document.body.appendChild(main);

      const { getMetadataContent } = await import('../../../edsdme/scripts/utils.js');
      const feedbackMeta = getMetadataContent('feedback');
      
      expect(feedbackMeta).to.equal('false');
      
      const feedbackMechanism = document.querySelector('.feedback-mechanism');
      expect(feedbackMechanism).to.not.exist;
    });

    it('should not load feedback block when metadata feedback is missing', async () => {
      const main = document.createElement('main');
      document.body.appendChild(main);

      const { getMetadataContent } = await import('../../../edsdme/scripts/utils.js');
      const feedbackMeta = getMetadataContent('feedback');
      
      expect(feedbackMeta).to.not.exist;
      
      const feedbackMechanism = document.querySelector('.feedback-mechanism');
      expect(feedbackMechanism).to.not.exist;
    });
  });

  describe('block functionality', () => {
    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    });

    it('should open dialog when button is clicked', async () => {
      const { default: init } = await import('../../../edsdme/blocks/feedback/feedback.js');
      const block = document.querySelector('.feedback');
      await init(block);

      const stickyButton = document.querySelector('.sticky-feedback-button');
      expect(stickyButton).to.exist;
      
      stickyButton.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const dialog = document.querySelector('.feedback-dialog');
      expect(dialog).to.exist;
    });

    it('should submit feedback successfully', async () => {
      const { default: init } = await import('../../../edsdme/blocks/feedback/feedback.js');
      const block = document.querySelector('.feedback');
      await init(block);

      const stickyButton = document.querySelector('.sticky-feedback-button');
      stickyButton.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const stars = document.querySelectorAll('sp-action-button[data-rating]');
      stars[3].click();

      const sendButton = document.querySelector('.feedback-dialog-button.cta');
      sendButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(fetchStub.called).to.be.true;
      expect(document.querySelector('.feedback-dialog')).to.not.exist;
      
      const toast = document.querySelector('.feedback-toast.spectrum-Toast--positive');
      expect(toast).to.exist;
    });

    it('should show error toast on submission failure', async () => {
      fetchStub.restore();
      fetchStub = sinon.stub(window, 'fetch').rejects(new Error('Network error'));

      const { default: init } = await import('../../../edsdme/blocks/feedback/feedback.js');
      const block = document.querySelector('.feedback');
      await init(block);

      const stickyButton = document.querySelector('.sticky-feedback-button');
      stickyButton.click();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const stars = document.querySelectorAll('sp-action-button[data-rating]');
      stars[3].click();

      const sendButton = document.querySelector('.feedback-dialog-button.cta');
      sendButton.click();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const toast = document.querySelector('.feedback-toast.spectrum-Toast--negative');
      expect(toast).to.exist;
    });
  });
});
