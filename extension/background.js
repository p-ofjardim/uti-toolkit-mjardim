/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

// Abre o UTI Toolkit numa aba dedicada ao clicar no ícone da extensão.
// Se já existir uma aba com a extensão aberta, foca nela em vez de criar outra.

const APP_PAGE = browser.runtime.getURL("index.html");

browser.browserAction.onClicked.addListener(async () => {
  const tabs = await browser.tabs.query({ url: APP_PAGE });
  if (tabs.length > 0) {
    // Já existe uma aba aberta — foca nela
    await browser.tabs.update(tabs[0].id, { active: true });
    await browser.windows.update(tabs[0].windowId, { focused: true });
  } else {
    // Abre uma nova aba
    browser.tabs.create({ url: APP_PAGE });
  }
});
