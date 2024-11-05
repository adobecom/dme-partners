import { getLibs } from '../../scripts/utils.js';

const miloLibs = getLibs();
const { css } = await import(`${miloLibs}/deps/lit-all.min.js`);

const borderColor = css`#eaeaea`;

// eslint-disable-next-line import/prefer-default-export
export const logosCardsStyles = css`

  .partner-cards-collection {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .partner-cards-collection .card-wrapper {
    min-height: 80px;
    width: 100%;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    cursor: pointer;
  }

  .partner-cards-collection .card-wrapper:hover {
    box-shadow: 0px 2px 4px #00000029;
    border-color: #D3D3D3;
  }

  .card-header .card-icons {
    z-index: 1;
  }
`;
