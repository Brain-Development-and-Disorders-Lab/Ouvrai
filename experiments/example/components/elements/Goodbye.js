import { required } from '../utils';
import { DisplayElement } from './DisplayElement';

/**
 * Class representing a goodbye screen.
 * @extends DisplayElement
 */
export class Goodbye extends DisplayElement {
  /**
   * Create a goodbye screen element for displaying final bonus and confirmation code.
   * Includes a pre-configured button click listener for copying the code to clipboard.
   * @param {string} platform - 'P' (prolific), 'M' (mturk), or 'X' (neither)
   * @param {string} [prolificLink] - the prolific completion link from your study details
   */
  constructor(platform = required('platform'), prolificLink) {
    // Prolific link is required if you are using Prolific
    if (platform === 'P' && !prolificLink) {
      required('prolificLink');
    }
    let html = `
    <div id="goodbye-content" class="weblab-component-div">
      <h4 id="bonus-text" style="margin-block: 0;">Thank you for your help!</h4>
      <div id="mturk-div" class="weblab-component-div">
        <h4 style="margin-block: 0;">
          Return to MTurk and enter the following code to submit this HIT.
        </h4>
        <h3 id="code-text"></h3>
        <button id="copy-code-button">Copy code to clipboard</button>
      </div>
      <div id="prolific-div" class="weblab-component-div">
        <h4 id="return-to-prolific" style="margin-block: 0;">
          <a href="${prolificLink}">Click here to return to Prolific</a>
        </h4>
      </div>
    </div>`;
    super({
      element: html,
      hide: true,
      parent: document.getElementById('screen'),
    });
    this.codeText = document.getElementById('code-text');
    this.bonusText = document.getElementById('bonus-text');

    if (platform === 'P') {
      DisplayElement.hide(document.getElementById('mturk-div'));
    } else if (platform === 'M') {
      DisplayElement.hide(document.getElementById('prolific-div'));
    }

    document
      .getElementById('copy-code-button')
      .addEventListener('click', this.copyCode.bind(this));
  }

  /**
   * Add a specific bonus amount to the goodbye screen element.
   * @param {string} uid - uid of the participant, which generates the completion code
   * @param {string} bonusText - formatted text string indicating final bonus amount ('$0.00')
   */
  updateGoodbye(uid = required('uid'), bonusText = required('bonusText')) {
    this.codeText.textContent = uid;
    this.bonusText.textContent = `Thank you for your help! You earned a bonus of ${bonusText}.`;
  }

  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.codeText.textContent);
      this.codeText.style.transition = 'opacity 0.15s';
      this.codeText.style.opacity = 0.5;
      setTimeout(() => (this.codeText.style.opacity = 1), 150);
    } catch (error) {
      console.error(error.message);
    }
  }
}
