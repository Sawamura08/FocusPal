import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { taskCompletion } from '../../../../interfaces/export.object';

@Directive({
  selector: '[appTaskBackgroundColor]',
})
export class TaskBackgroundColorDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  @Input() appTaskBackgroundColor!: number;
  public status = taskCompletion;

  ngOnInit(): void {
    this.changeBackgroundColor(this.appTaskBackgroundColor);
  }
  public changeBackgroundColor = (taskStatus: number) => {
    let color: string;
    if (taskStatus === this.status.PENDING) {
      color = '#a5d0ed';
    } else if (taskStatus === this.status.COMPLETE) {
      color = '#9ed6a8';
    } else {
      color = '#f29a8d';
    }

    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  };
}
