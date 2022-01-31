import * as React from "react";
import './footer.css';
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer-list">
          <li>
            <Link to="https://conductionnl.github.io/commonground-gateway/" target="_blank">
              About
            </Link>
          </li>

          <li>
            <Link to="https://commonground-gateway.readthedocs.io/en/latest" target="_blank">
              Docs
            </Link>
          </li>

          <li>
            <Link to="https://github.com/ConductionNL/commonground-gateway/blob/development/docs/docs/index.md" target="_blank">
              License
            </Link>
          </li>

          <li>
            <Link to="https://github.com/ConductionNL/commonground-gateway/" target="_blank">
              Code
            </Link>
          </li>
        </ul>

        <ul className="footer-list">
          <li>
            <Link to="https://conduction.nl" target="_blank">
              Code with <FontAwesomeIcon className="footer-list-itemIcon--red" icon={faHeart} /> by Conduction
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
