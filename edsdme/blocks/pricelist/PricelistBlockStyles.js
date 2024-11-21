import { getLibs } from '../../scripts/utils.js';

const miloLibs = getLibs();
const { css } = await import(`${miloLibs}/deps/lit-all.min.js`);



// eslint-disable-next-line import/prefer-default-export
export  const pricelistBlockStyles = css`
  .partner-cards-sidebar {
    width: 200px;
    max-width: 200px;
    padding: 8px 0 0 0;
  }

  .partner-cards {
    display: grid;
    grid-template-columns: 200px auto;
    gap: 32px;
    margin-right: 0;
  }`;
