import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

describe('announcement date block', () => {
  before(async () => {
    const module = await import('../../../edsdme/blocks/announcement-date/announcement-date.js');
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const announcementDateBlock = document.querySelector('.announcement-date');
    await module.default(announcementDateBlock);
  });

  it('should display the expected date', async () => {
    const announcementDate = document.querySelector('time.announcement-date');
    expect(announcementDate).to.exist;
    expect(announcementDate.getAttribute('datetime')).to.equal('2024-01-01T23:00:00.000Z');
    expect(announcementDate.innerText).to.equal('Jan 2, 2024');
  });

  it('should render inside a wrapper element', async () => {
    const announcementDateWrapper = document.querySelector('.announcement-date-wrapper');
    const announcementDate = announcementDateWrapper.querySelector('time.announcement-date');
    expect(announcementDateWrapper).to.exist;
    expect(announcementDate).to.exist;
  });
});
