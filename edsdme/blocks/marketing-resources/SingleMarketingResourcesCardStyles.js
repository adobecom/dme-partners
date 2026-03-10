import { getLibs } from '../../scripts/utils.js';

const miloLibs = getLibs();
const { css } = await import(`${miloLibs}/deps/lit-all.min.js`);

const borderColor = css`#eaeaea`;
const blueColor = css`#1473e6`;
const darkGrey = css`#323232`;
const darkGrey2 = css`#222222`;
const white = css`#fff`;

export const singleMarketingResourcesCardStyles = css`
  .single-marketing-resources-card * {
    box-sizing: border-box;
  }

  .single-marketing-resources-card {
    display: flex;
    flex-direction: column;
    background-color: ${white};
    border: 1px solid ${borderColor};
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 380px;
  }

  .single-marketing-resources-card:hover {
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
    transition: box-shadow .3s ease-in-out;
  }

  .single-marketing-resources-card .card-header {
    min-height: 240px;
    max-height: 240px;
    background-color: ${darkGrey};
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: relative;
  }

  .single-marketing-resources-card:hover .card-header:after {
    opacity: 1;
  }

  .single-marketing-resources-card .card-header:after {
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 0;
    background-color: rgba(0,0,0,.35);
    opacity: 0;
    transition: opacity .3s ease-in-out;
  }

  .single-marketing-resources-card .card-file-type {
    position: absolute;
    left: 15px;
    top: 15px;
    padding: 5px 10px;
    background: ${white};
    font-size: 12px;
    line-height: 14px;
    border-radius: 5px;
    border: 1px solid #676767;
    color: #444444;
    text-transform: uppercase;
  }

  .single-marketing-resources-card .card-content {
    display: flex;
    flex-direction: column;
    background-color: ${white};
    padding: 16px;
  }

  .single-marketing-resources-card .card-title {
    color: ${darkGrey};
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.375rem;
    word-break: break-word;
    max-height: 2.75rem;
    margin: 7px 0 7px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }

  .single-marketing-resources-card .card-description {
    color: #505050;
    font-size: .875rem;
    line-height: 1.3125rem;
    font-weight: 400;
    word-break: break-word;
    margin: 0 0 12px;
    max-height: 3.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .single-marketing-resources-card .card-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
  }

  .single-marketing-resources-card .card-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .875rem;
    line-height: 1.063rem;
    font-weight: 700;
    min-width: 60px;
    max-width: 100%;
    height: 28px;
    max-height: 32px;
    margin-left: 16px;
    padding-left: 14px;
    padding-right: 14px;
    text-decoration: none;
    color: ${darkGrey2};
    border: 2px solid ${darkGrey2};
    border-radius: 16px;
    background-color: #ffffff00;
    cursor: pointer;
    transition: border-color .3s ease-in-out,background-color .3s ease-in-out;
  }

  .single-marketing-resources-card .card-btn:hover {
    text-decoration: none;
    border-color: ${darkGrey2};
    background-color: ${darkGrey2};
    color: ${white};
  }

  .single-marketing-resources-card .card-open-link {
    font-size: .875rem;
    line-height: 1.063rem;
    font-weight: 700;
    color: ${blueColor};
  }

  .single-marketing-resources-card .card-details {
    color: #747474;
    font-size: .875rem;
    line-height: 1.3125rem;
    word-break: break-word;
    max-height: 3.9375rem;
    padding: 0;
  }

  .link-wrapper {
    text-decoration: none;
  }

   @media screen and (max-width: 768px) {
    .card-description {
      display: none !important;
    }
  }
`;
