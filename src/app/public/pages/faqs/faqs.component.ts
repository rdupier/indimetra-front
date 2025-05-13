import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css',
})
export class FaqsComponent {
  faqList = [
    {
      question: '¿Para quién va dirigido?',
      answer:
        'Indimetra está pensado para cineastas independientes que desean dar visibilidad a su trabajo, así como para amantes del cine que buscan descubrir y apoyar nuevas producciones. También es una herramienta útil para festivales, críticos y cualquier persona interesada en el cine emergente.',
      isOpen: false,
    },
    {
      question: '¿Cuánto cuesta?',
      answer:
        'Indimetra es completamente gratuito para todos los usuarios. Tanto cineastas como espectadores pueden registrarse sin costo y disfrutar del contenido disponible en la plataforma.',
      isOpen: false,
    },
    {
      question: '¿Qué contenido puedo subir?',
      answer:
        'Los usuarios pueden compartir sus propios cortometrajes originales a través de enlaces de YouTube. La plataforma está enfocada en la difusión de cine independiente, por lo que el contenido debe respetar los derechos de autor y seguir nuestras normas de calidad y comunidad.',
      isOpen: false,
    },
  ];

  toggleFaq(index: number): void {
    this.faqList[index].isOpen = !this.faqList[index].isOpen;
  }
}
