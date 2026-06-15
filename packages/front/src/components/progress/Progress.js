import React, {Component} from "react";
import './Progress.css';

class Progress extends Component {
  get progressClassName() {
    const {perc, invert} = this.props;

    if (invert) {
      if (perc < 33) {
        return 'high';
      } else if (perc < 66) {
        return 'medium';
      }
    } else {
      if (perc > 66) {
        return 'high';
      } else if (perc > 33) {
        return 'medium';
      }
    }

    return '';
  }

  render() {
    const {perc, current, max} = this.props;

    const className = `progress-bar ${this.progressClassName}`;
    const displayValue = current !== undefined
      ? (max !== undefined ? `${current}/${max}` : current)
      : '';

    return (
      <div className="progress">
        <div
          className={className}
          style={{width: `${perc}%`}}
        ></div>
        {current !== undefined && (
          <div className="progress-text-container">
            <span className="progress-value-dark" style={{clipPath: `inset(0 ${100 - perc}% 0 0)`}}>
              {displayValue}
            </span>
            <span className="progress-value-light" style={{clipPath: `inset(0 0 0 ${perc}%)`}}>
              {displayValue}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default Progress;
