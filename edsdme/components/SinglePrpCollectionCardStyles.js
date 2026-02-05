import { getLibs } from '../scripts/utils.js';

const miloLibs = getLibs();
const { css } = await import(`${miloLibs}/deps/lit-all.min.js`);

const borderColor = css`#eaeaea`;
const blueColor = css`#1473e6`;

export const singlePrpCollectionCardStyles = css`
  .single-prp-collection-card * {
    box-sizing: border-box;
  }

  .single-prp-collection-card {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid ${borderColor};
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 400px;
  }

  .single-prp-collection-card:hover {
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
    transition: box-shadow .3s ease-in-out;
  }

  .single-prp-collection-card .card-header {
    min-height: 192px;
    max-height: 192px;
    background-color: #323232;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    position: relative;
  }

  .single-prp-collection-card:hover .card-header:after {
    opacity: 1;
  }

  .single-prp-collection-card .card-header:after {
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

  .single-prp-collection-card .card-file-type {
    position: absolute;
    left: 10px;
    top: 10px;
    padding: 0px 10px;
    background: #fff;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid ${borderColor};
  }

  .single-prp-collection-card .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
    padding: 16px 16px 20px;
    height: 100%;
  }

  .single-prp-collection-card .card-title {
    color: #323232;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.375rem;
    word-break: break-word;
    max-height: 2.75rem;
    margin: 0 0 7px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
  }

  .single-prp-collection-card .card-description {
    color: #505050;
    font-size: .875rem;
    line-height: 1.3125rem;
    font-weight: 400;
    word-break: break-word;
    margin: 0 0 14px;
    max-height: 3.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
  }

  .single-prp-collection-card .card-footer {
    display: flex;
    justify-content: end;
    align-items: center;
  }

  .single-prp-collection-card .card-text {
    border-bottom: 1px solid ${borderColor};
  }

  .single-prp-collection-card .card-open-link {
    font-size: .875rem;
    line-height: 1.063rem;
    font-weight: 700;
    color: ${blueColor};
  }

  .single-prp-collection-card .card-btn {
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
    color: #222222;
    border: 2px solid #222222;
    border-radius: 16px;
    background-color: #ffffff00;
    cursor: pointer;
    transition: border-color .3s ease-in-out,background-color .3s ease-in-out;
  }

  .single-prp-collection-card .card-btn:hover {
    text-decoration: none;
    border-color: #222222;
    background-color: #222222;
    color: #ffffff;
  }

  .single-prp-collection-card .card-date {
    color: #747474;
    font-size: .875rem;
    line-height: 1.3125rem;
    word-break: break-word;
    max-height: 3.9375rem;
    padding: 0;
  }
`;