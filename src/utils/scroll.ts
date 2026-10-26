/**
 * Smoothly scrolls to an element by ID, ensuring the element is comfortably visible
 * below any sticky header or navigation elements.
 * 
 * @param elementId The HTML ID attribute of the destination element (without '#')
 * @param extraPadding Additional spacing below the header in px (default: 16)
 */
export const smoothScrollTo = (elementId: string, extraPadding: number = 16): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Retrieve current height of the sticky header to calculate the exact offset
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 90;
  const totalOffset = headerHeight + extraPadding;

  const elementPosition = element.getBoundingClientRect().top;
  const targetY = elementPosition + window.pageYOffset - totalOffset;

  window.scrollTo({
    top: Math.max(0, Math.round(targetY)),
    behavior: 'smooth',
  });
};
