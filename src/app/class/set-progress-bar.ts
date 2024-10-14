export class SetProgressBar {
  /* SET UP THE PROGRESS BAR */
  public progressBar = (
    total: number,
    complete: number | null,
    pending?: number
  ) => {
    let percentage;
    if (complete) {
      percentage = (complete / total) * 100;
    } else {
      percentage = (pending! / total) * 100;
      percentage = 100 - percentage;
    }
    const shadow = '#c0392b';
    const mainColor = '#ff6f61';

    const gradient = `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(${shadow} ${percentage}%, ${mainColor} 0)`;

    return gradient;
  };
}
