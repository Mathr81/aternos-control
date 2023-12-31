const puppeteer = require('puppeteer');

class AternosControl {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async login(username, password) {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    
    await this.page.goto('https://aternos.org/go');
    
    // Customize the login and other actions as needed
    
    await this.page.type('#user', username);
    await this.page.type('#password', password);
    await this.page.click('#login');
    
    // Wait for some time to ensure the page loads data or perform other actions
    
    // Example: Capture a screenshot of the page
    await this.page.screenshot({ path: 'aternos.png' });
  }

  async chooseServer(serverName) {
    // Wait for the page to load after login
    await this.page.waitForNavigation();
    
    // Find the server in the list
    const serverElement = await this.page.$(`a[title="${serverName}"]`);
    
    if (serverElement) {
      // Click on the server to navigate to its control panel
      await serverElement.click();
      console.log(`Navigating to server: ${serverName}`);
    } else {
      throw new Error(`Server not found: ${serverName}`);
    }
  }

  async getServerStatus() {
    await this.page.waitForSelector('.statuslabel');
    const statusElement = await this.page.$('.statuslabel');
    const statusText = await this.page.evaluate(element => element.textContent, statusElement);
    console.log(`Server Status: ${statusText}`);
    return statusText;
  }

  async toggleServer() {
    await this.page.waitForSelector('.start');
    const startButton = await this.page.$('.start');
    const startButtonText = await this.page.evaluate(element => element.textContent, startButton);
    
    if (startButtonText === 'Start') {
      await startButton.click();
      console.log('Starting the server...');
    } else if (startButtonText === 'Stop') {
      await startButton.click();
      console.log('Stopping the server...');
    }
    
    // Wait for the status to update after the action
    await this.page.waitForFunction(() => {
      const statusElement = document.querySelector('.statuslabel');
      return statusElement.textContent !== '';
    });
  }

  async disconnect() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = AternosControl;
