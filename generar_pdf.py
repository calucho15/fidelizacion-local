import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def create_executive_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor('#0d9488') # Teal 600
    dark_bg = colors.HexColor('#0f172a')     # Slate 900
    text_color = colors.HexColor('#1e293b')  # Slate 800
    light_bg = colors.HexColor('#f8fafc')

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=dark_bg
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=primary_color
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=dark_bg,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=primary_color,
        spaceBefore=6,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color,
        alignment=4 # Justified
    )

    bullet_style = ParagraphStyle(
        'BulletItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_color,
        leftIndent=15,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#065f46')
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=text_color
    )

    table_zero_style = ParagraphStyle(
        'TDZero',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#059669')
    )

    elements = []

    # HEADER
    elements.append(Paragraph("Plataforma de Fidelización para Comercios", title_style))
    elements.append(Paragraph("Resumen Ejecutivo y Estudio de Viabilidad del Negocio Local", subtitle_style))
    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=4, spaceAfter=12))

    # SECCION 1
    elements.append(Paragraph("1. La Oportunidad de Negocio en Nuestra Ciudad", h1_style))
    elements.append(Paragraph(
        "La gran mayoría de los comercios locales (cafeterías, restaurantes, minimercados, carnicerías, peluquerías) "
        "pierden dinero todos los meses por una fuga silenciosa: <b>clientes satisfechos que vinieron una o dos veces, pero nunca más volvieron porque simplemente se olvidaron de que el local existía</b>.",
        body_style
    ))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(
        "Atraer un cliente nuevo mediante publicidad en redes sociales o folletos cuesta hasta <b>5 veces más</b> que incentivar a un cliente que ya conoce el negocio a volver una vez más al mes. Un club de puntos crea una razón concreta para que el cliente siempre elija este comercio frente a la competencia.",
        body_style
    ))
    elements.append(Spacer(1, 8))

    # COMPARATIVA
    comp_data = [
        [
            Paragraph("<b>❌ Lo que falla en las aplicaciones actuales</b>", table_header_style),
            Paragraph("<b>✅ Nuestra Solución (Ventaja Local)</b>", table_header_style)
        ],
        [
            Paragraph("• Obligan al cliente a descargar apps pesadas de Play Store / App Store.<br/>"
                      "• Los clientes no tienen espacio en el celular y se van de la fila.<br/>"
                      "• Plataformas caras de empresas extranjeras sin soporte humano.<br/>"
                      "• Sistemas lentos que atrasan el cobro en caja.", table_cell_style),
            Paragraph("• <b>Sin descargas:</b> Funciona desde el navegador al escanear un QR.<br/>"
                      "• <b>Marca propia:</b> Cada comercio tiene la app con su logo y colores.<br/>"
                      "• <b>Trato cercano y presencial:</b> Les llevamos el cartel acrílico para el mostrador y capacitamos al cajero en 10 minutos.<br/>"
                      "• <b>Cobro en 3 segundos:</b> Carga instantánea por WhatsApp.", table_cell_style)
        ]
    ]
    comp_table = Table(comp_data, colWidths=[260, 270])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#fee2e2')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#ccfbf1')),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor('#fff1f2')),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor('#f0fdfa')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(comp_table)
    elements.append(Spacer(1, 10))

    # SECCION 2: DINAMICA
    elements.append(Paragraph("2. Cómo Funciona en el Mostrador (Sin retrasar la caja)", h1_style))
    
    box_data = [[Paragraph(
        "<b>Operación en menos de 5 segundos:</b> Cuando el cliente paga su compra, el cajero le pregunta: "
        "<i>'¿Sumás puntos para tu premio?'</i>. El cliente solo muestra su QR o dice su número de WhatsApp. "
        "El cajero marca el monto y los puntos quedan acreditados al instante en la pantalla del cliente.",
        callout_style
    )]]
    box_table = Table(box_data, colWidths=[530])
    box_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#10b981')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(box_table)
    elements.append(Spacer(1, 6))

    elements.append(Paragraph("• <b>Registro en 3 segundos:</b> El cliente nuevo ingresa su nombre y WhatsApp y recibe puntos de bienvenida de regalo.", bullet_style))
    elements.append(Paragraph("• <b>Progreso visible:</b> El cliente ve cuánto le falta para su premio (ej: <i>'A 30 puntos de tu café gratis'</i>).", bullet_style))
    elements.append(Paragraph("• <b>Ruleta de Premios:</b> Minijuego interactivo en el celular para desbloquear beneficios sorpresa.", bullet_style))
    elements.append(Spacer(1, 8))

    # SECCION 3: COSTOS
    elements.append(Paragraph("3. Estructura de Costos de Servidores (Riesgo Prácticamente $0)", h1_style))
    elements.append(Paragraph(
        "El sistema fue diseñado sobre tecnología moderna en la nube aprovechando las capas gratuitas profesionales para emprendimientos tecnológicos:",
        body_style
    ))
    elements.append(Spacer(1, 4))

    costs_data = [
        [Paragraph("<b>Concepto Técnico</b>", table_header_style), 
         Paragraph("<b>Etapa Inicial (1 a 10 comercios)</b>", table_header_style), 
         Paragraph("<b>Etapa Escala (10 a 50 comercios)</b>", table_header_style)],
        [Paragraph("Alojamiento Web (Vercel)", table_cell_style), 
         Paragraph("<b>$0 USD / mes</b> (Plan Gratuito)", table_zero_style), 
         Paragraph("$20 USD / mes", table_cell_style)],
        [Paragraph("Base de Datos en la Nube (Supabase)", table_cell_style), 
         Paragraph("<b>$0 USD / mes</b> (Hasta 50.000 usuarios)", table_zero_style), 
         Paragraph("$25 USD / mes", table_cell_style)],
        [Paragraph("Dominio Web Propio (.com o local)", table_cell_style), 
         Paragraph("~$12 USD / año", table_cell_style), 
         Paragraph("~$12 USD / año", table_cell_style)],
        [Paragraph("Cartel Acrílico con QR para mostrador", table_cell_style), 
         Paragraph("~$3 a $5 USD por local (físico)", table_cell_style), 
         Paragraph("Se cobra al cliente en el alta", table_cell_style)],
        [Paragraph("<b>COSTO MENSUAL TOTAL</b>", table_header_style), 
         Paragraph("<b>~$0 USD / MES</b>", table_zero_style), 
         Paragraph("<b>~$45 USD / MES</b>", table_header_style)]
    ]
    cost_table = Table(costs_data, colWidths=[200, 170, 160])
    cost_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(cost_table)

    # SALTO DE PAGINA
    elements.append(PageBreak())

    # PAGINA 2
    elements.append(Paragraph("Plataforma de Fidelización para Comercios", title_style))
    elements.append(Paragraph("Modelo de Ingresos y Estrategia de Lanzamiento en la Ciudad", subtitle_style))
    elements.append(Spacer(1, 4))
    elements.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=4, spaceAfter=12))

    # SECCION 4: INGRESOS
    elements.append(Paragraph("4. Modelo de Ingresos (Cómo Generar Ganancias)", h1_style))
    elements.append(Paragraph(
        "El negocio combina un cobro puntual de alta por comercio más una mensualidad fija recurrente:",
        body_style
    ))
    elements.append(Spacer(1, 6))

    rev_data = [
        [
            Paragraph("<b>1. Cobro por Alta y Puesta en Marcha</b>", table_header_style),
            Paragraph("<b>2. Suscripción Mensual Recurrente</b>", table_header_style)
        ],
        [
            Paragraph("Se cobra una única vez al comenzar con el comercio.<br/>"
                      "<b>Incluye:</b><br/>"
                      "• Personalización de la app con el logo y colores del local.<br/>"
                      "• Asesoramiento para definir la tabla de premios según su ticket promedio.<br/>"
                      "• Entrega física del cartel acrílico con código QR para el mostrador.<br/>"
                      "• Capacitación presencial de 15 minutos al personal de caja.", table_cell_style),
            Paragraph("Cuota mensual fija por el mantenimiento del software y el servicio.<br/>"
                      "<b>Incluye:</b><br/>"
                      "• Uso ilimitado de la plataforma por los clientes del negocio.<br/>"
                      "• Almacenamiento y resguardo de la base de datos de clientes.<br/>"
                      "• Soporte técnico prioritario y directo por WhatsApp.<br/>"
                      "• <b>Margen:</b> Con solo 2 a 3 comercios se cubren todos los costos operativos y el resto es ganancia recurrente limpia.", table_cell_style)
        ]
    ]
    rev_table = Table(rev_data, colWidths=[260, 270])
    rev_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#e0f2fe')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#e0e7ff')),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor('#f0f9ff')),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor('#eef2ff')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(rev_table)
    elements.append(Spacer(1, 10))

    # SECCION 5: ESTADO ACTUAL
    elements.append(Paragraph("5. Estado Actual del Software (Ya Construido)", h1_style))
    elements.append(Paragraph(
        "No estamos partiendo de cero. La estructura técnica base ya se encuentra completamente programada y funcionando en nuestro entorno:",
        body_style
    ))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("• <b>Landing Comercial Web:</b> Página de presentación para mostrar a dueños de negocios con explicaciones y llamado a la acción.", bullet_style))
    elements.append(Paragraph("• <b>App Web de Clientes (PWA):</b> Tarjeta virtual con puntos acumulados, ruleta interactiva, catálogo de premios y canje con animación.", bullet_style))
    elements.append(Paragraph("• <b>Terminal de Caja / Mostrador:</b> Pantalla rápida para que el cajero busque por celular y sume puntos en un par de segundos.", bullet_style))
    elements.append(Paragraph("• <b>Base de Datos Multi-Comercio:</b> Esquema SQL profesional listo para alojar decenas de comercios de forma aislada y segura.", bullet_style))
    elements.append(Spacer(1, 8))

    # SECCION 6: PLAN DE ACCIÓN
    elements.append(Paragraph("6. Plan de Acción Recomendado (Siguientes Pasos)", h1_style))
    
    plan_box = [[Paragraph(
        "<b>Estrategia de Validación con Riesgo Cero:</b> La mejor manera de empezar no es salir a vender a desconocidos de golpe, sino seleccionar <b>2 o 3 comercios amigos o de confianza en nuestra ciudad</b> (ej: una cafetería, una hamburguesería o una barbería) y ofrecerles el piloto gratuito durante 30 días a cambio de medir resultados.",
        callout_style
    )]]
    p_table = Table(plan_box, colWidths=[530])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#10b981')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(p_table)
    elements.append(Spacer(1, 6))

    elements.append(Paragraph("1. <b>Semana 1 (Puesta en Marcha Piloto):</b> Imprimir el cartel acrílico para el primer negocio amigo, subir su logo y capacitar al cajero.", bullet_style))
    elements.append(Paragraph("2. <b>Semana 2 y 3 (Medición de Uso):</b> Observar cuántos clientes escanean el QR, cuántos vuelven a sumar puntos y la reacción de la gente.", bullet_style))
    elements.append(Paragraph("3. <b>Semana 4 (Testimonios y Expansión):</b> Sacar fotos reales del mostrador en funcionamiento y pedirle al dueño un testimonio grabado. Con esa prueba social real en mano, salir a ofrecer el servicio formalmente al resto de comercios de la ciudad.", bullet_style))
    elements.append(Spacer(1, 14))

    # CONCLUSIÓN FINAL
    conclusion_data = [[Paragraph(
        "<b>CONCLUSIÓN GENERAL:</b> El proyecto es <b>100% viable técnicamente</b>, tiene un <b>costo de infraestructura inicial de $0/mes</b> y cuenta con una enorme ventaja competitiva local: estar presentes físicamente en la ciudad, ofreciendo trato humano y cartelería en mano, algo que las grandes empresas de software no pueden igualar.",
        ParagraphStyle('Conc', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=14, textColor=colors.HexColor('#065f46'), alignment=1)
    )]]
    conc_table = Table(conclusion_data, colWidths=[530])
    conc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#d1fae5')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#059669')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(conc_table)

    doc.build(elements)
    print(f"PDF generado con éxito en: {filename}")

if __name__ == '__main__':
    target = os.path.join(os.getcwd(), 'Resumen_Ejecutivo_Sistema_Fidelizacion.pdf')
    create_executive_pdf(target)
