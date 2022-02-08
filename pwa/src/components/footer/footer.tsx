import * as React from "react";
import './footer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface FooterProps {
  layoutClassName?: string
}

const Footer: React.FC<FooterProps> = ({layoutClassName}) => {
  return (
    <footer className={`footer ${layoutClassName}`}>
      <div className="container">
        <ul className="footer-list">
          <li>
            <a href="https://conductionnl.github.io/commonground-gateway/" target="_blank">
              About
            </a>
          </li>

          <li>
            <a href="https://commonground-gateway.readthedocs.io/en/latest" target="_blank">
              Docs
            </a>
          </li>

          <li>
            <a href="https://github.com/ConductionNL/commonground-gateway/blob/development/docs/docs/index.md" target="_blank">
              License
            </a>
          </li>

          <li>
            <a href="https://github.com/ConductionNL/commonground-gateway/" target="_blank">
              Code
            </a>
          </li>
        </ul>

        <ul className="footer-list">
          <li>
            <a href="https://conduction.nl" target="_blank">
              Coded with <FontAwesomeIcon className="footer-list-itemIcon--red" icon={faHeart} /> by Conduction
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
