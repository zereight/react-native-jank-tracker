describe('Example App E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('TTI 측정 버튼 클릭 시 결과가 표시된다', async () => {
    await element(by.text('TTI 측정 버튼')).tap();
    await expect(element(by.text(/TTI: [\d.]+ms/))).toBeVisible();
  });
});
