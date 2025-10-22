import { AfterViewInit, ElementRef, Directive, Input } from '@angular/core';

@Directive({
  selector: '[bgImage]'
})

export class BgImageDirective implements AfterViewInit {
@Input() imgUrl: string;
 constructor(private elRef: ElementRef) {
 }
 ngAfterViewInit(): void {
   this.elRef.nativeElement.style.backgroundImage = 'url(' + this.imgUrl + ')';
   this.elRef.nativeElement.style.backgroundRepeat = 'no-repeat';
  // this.elRef.nativeElement.style.backgroundSize = 'cover';
   this.elRef.nativeElement.style.backgroundSize = 'contain';
   this.elRef.nativeElement.style.backgroundPosition = 'center';
   }
}
