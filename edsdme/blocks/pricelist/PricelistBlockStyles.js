import { getLibs } from '../../scripts/utils.js';

const miloLibs = getLibs();
const { css } = await import(`${miloLibs}/deps/lit-all.min.js`);

const borderColor = css`#eaeaea`;
const grayColor = css`#747474`;
const whiteColor = css`#FFFFFF `;
const btnGrayColor = css`#D3D3D3`;

// eslint-disable-next-line import/prefer-default-export
export const pricelistBlockStyles = css`
    .partner-cards-sidebar .filter .filter-label {
        max-width: 150px;
    }
    
    .partner-cards {
        display: flex;
        margin-right: 0;
        margin-top: 20px;
    }
    
    @media screen and (min-width: 1201px) {
        .partner-cards-sidebar {
            width: 200px;
            max-width: 200px;
            padding: 8px 0 0 0;
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    tr {
        border: 1px solid ${borderColor};
        box-sizing: content-box;
    }

    thead tr {
        border: none;
    }

    th, td {
        font-size: 14px;
        font-family: inherit;
        line-height: 17px;
        height: 36px;
        padding: 2px 12px;
        text-align: left;
        width: 20%;
        min-width: 150px;
    }

    /* Container for horizontal scrolling on mobile */
    .table-container {
        overflow-x: auto;
        margin: 20px 0;
    }

    tr td:nth-child(5), tr th:nth-child(5) {
        text-align: right;
        width: 50%;
    }

    tr td:nth-child(1), tr th:nth-child(1) {
        width: 30%;
        min-width: 200px;
    }

    /* Mobile-specific styles */
    @media (max-width: 1200px) {
        table {
            display: flex;
            flex-direction: column;
            width: 100%;
            overflow-x: auto;
        }

        tbody {
            min-width: fit-content;
        }

        tr {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }

        th, td {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        /* Move 5th column to the first position */
        tr td:nth-child(5), tr th:nth-child(5) {
            order: -1;
        }
    }

    .partner-cards-collection {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .partner-cards-content {
        width: 100%;
    }

    sp-icon-download {
        color: ${grayColor}
    }

    .partner-cards-header .partner-cards-sort-wrapper .filters-btn-mobile {
        background: ${whiteColor};
        border: 1px solid ${btnGrayColor};
        font-weight: normal;
        font-size: 14px;
        margin-bottom: 0;
    }

    .search-wrapper sp-field-label {
        color: #747474;
    }

    .partner-cards-sidebar .sidebar-slider {
        margin-top: 25px;
    }

    .pagination-wrapper-load-more .load-more-btn {
        border-radius: 5px;
        border: 1px solid ${btnGrayColor};
        font-weight: normal;
        margin-bottom: 20px;
    }

    .pagination-wrapper-load-more .load-more-btn:hover {
        background-color: ${btnGrayColor};
        border: 1px solid ${btnGrayColor};
    }
`;
