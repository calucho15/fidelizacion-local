import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def create_executive_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    primary_color = colors.HexColor('#0d9488') # Teal 600
    dark_bg = colors.HexColor('#0f172a')     # Slate 900
    text_color = colors.HexColor('#1e293b')  # Slate 800

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=dark_bg
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=primary_color
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=dark_bg,
        spaceBefore=10,
        spaceAfter=5
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=text_color,
        alignment=4
    )

    bullet_style = ParagraphStyle(
        'BulletItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=text_color,
        leftIndent=12,
        spaceAfter=2
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#065f46')
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#0f172a')
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10,
        textColor=text_color
    )

    table_zero_style = ParagraphStyle(
        'TDZero',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10,
        textColor=colors.HexColor('#059669')
    )

    elements = []

    # ==================== PÁGINA 1 ====================
    elements.append(Paragraph("Smart Loyalty Engine: Fidelización para Comercios Locales", title_style))
    elements.append(Paragraph("Plan Maestro y Estudio de Factibilidad | Visión Estratégica Carlos Rivas", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=3, spaceAfter=8))

    # SECCIÓN 1: EL CONCEPTO
    elements.append(Paragraph("1. La Visión Central: No Vendemos Puntos, Vendemos Recurrencia", h1_style))
    elements.append(Paragraph(
        "Como demuestran los grandes referentes mundiales (<b>Starbucks Rewards</b>, donde el 60% de sus ventas provienen de miembros del club, y <b>Sephora Beauty Insider</b> con +45M de miembros), la fidelización no se trata de regalar puntos aislados, sino de <b>construir razones psicológicas para volver</b> al negocio.",
        body_style
    ))
    elements.append(Spacer(1, 3))
    elements.append(Paragraph(
        "El secreto de Starbucks es no decirle al cliente: <i>'Tenés 400 puntos'</i>, sino: <b>'Estás a solo 80 puntos de tu café gratis'</b>. Esa sensación de progreso incompleto es lo que motiva a regresar hoy en lugar de postergar la compra.",
        body_style
    ))
    elements.append(Spacer(1, 6))

    # COMPARATIVA TÉCNICA: NEXT.JS VS WORDPRESS
    elements.append(Paragraph("2. Arquitectura Tecnológica: ¿Por qué Next.js + Supabase vs. WordPress?", h1_style))
    
    tech_data = [
        [
            Paragraph("<b>WordPress + Elementor + Plugins de Terceros</b>", table_header_style),
            Paragraph("<b>Stack Moderno: Next.js 16 + Supabase (PostgreSQL)</b>", table_header_style)
        ],
        [
            Paragraph("• Depender de 15 plugins de terceros genera conflictos y lentitud.<br/>"
                      "• Las bases de datos de WordPress (`wp_postmeta`) colapsan con miles de transacciones y clientes.<br/>"
                      "• Exige pagar hosting VPS desde el día 1 ($15–$30 USD/mes).<br/>"
                      "• No es una aplicación nativa multi-tenant limpia.", table_cell_style),
            Paragraph("• <b>100% Código a medida y modular:</b> Sin plugins pesados.<br/>"
                      "• <b>Base de datos PostgreSQL real:</b> Soporta 100 comercios y millones de transacciones de puntos a máxima velocidad.<br/>"
                      "• <b>Costo inicial $0 USD/mes:</b> Aprovecha las capas gratuitas profesionales de Vercel y Supabase.<br/>"
                      "• <b>PWA ultra-rápida:</b> Carga en móviles en menos de 1 segundo.", table_cell_style)
        ]
    ]
    tech_table = Table(tech_data, colWidths=[265, 275])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#fee2e2')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#ccfbf1')),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor('#fff1f2')),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor('#f0fdfa')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(tech_table)
    elements.append(Spacer(1, 6))

    # SECCIÓN 3: EL MOTOR INTELIGENTE
    elements.append(Paragraph("3. Customer Loyalty Score & Alertas Predictivas de Abandono", h1_style))
    box_data = [[Paragraph(
        "<b>Inteligencia Comercial Aplicada:</b> El sistema calcula un <b>Loyalty Score (0 a 100)</b> basado en el algoritmo RFM (Recencia, Frecuencia y Monto). Si un cliente solía venir cada 15 días y van 22 días sin visitarnos, el sistema lo clasifica en <b>'🟡 En Riesgo'</b> y permite disparar un mensaje automático de rescate por WhatsApp con un beneficio tentador.",
        callout_style
    )]]
    box_table = Table(box_data, colWidths=[540])
    box_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#10b981')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(box_table)
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("• <b>Métrica Clave 'Dinero Recuperado':</b> El comerciante ve en su panel cuánto dinero volvió a su caja gracias a los clientes rescatados.", bullet_style))
    elements.append(Paragraph("• <b>Operación en Caja en 3 Segundos:</b> El cajero no pierde tiempo: busca por WhatsApp y carga puntos en 1 clic.", bullet_style))

    # TABLA DE COSTOS
    elements.append(Spacer(1, 4))
    costs_data = [
        [Paragraph("<b>Concepto de Infraestructura</b>", table_header_style), 
         Paragraph("<b>Fase Piloto (1 a 10 comercios)</b>", table_header_style), 
         Paragraph("<b>Escala (10 a 50 comercios)</b>", table_header_style)],
        [Paragraph("Alojamiento Web (Vercel)", table_cell_style), 
         Paragraph("<b>$0 USD / mes</b> (Capa Gratuita)", table_zero_style), 
         Paragraph("$20 USD / mes", table_cell_style)],
        [Paragraph("Base de Datos PostgreSQL (Supabase)", table_cell_style), 
         Paragraph("<b>$0 USD / mes</b> (Hasta 50.000 clientes)", table_zero_style), 
         Paragraph("$25 USD / mes", table_cell_style)],
        [Paragraph("Cartel Acrílico Mostrador + QR", table_cell_style), 
         Paragraph("~$3 a $5 USD (físico local)", table_cell_style), 
         Paragraph("Se cobra al cliente en el alta", table_cell_style)],
        [Paragraph("<b>COSTO TECNOLÓGICO TOTAL</b>", table_header_style), 
         Paragraph("<b>~$0 USD / MES</b>", table_zero_style), 
         Paragraph("<b>~$45 USD / MES</b>", table_header_style)]
    ]
    cost_table = Table(costs_data, colWidths=[200, 180, 160])
    cost_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(cost_table)

    # ==================== PÁGINA 2 ====================
    elements.append(PageBreak())

    elements.append(Paragraph("Smart Loyalty Engine: Plan Maestro y Hoja de Ruta", title_style))
    elements.append(Paragraph("Estrategia de Lanzamiento en 4 Fases y Modelo de Ingresos", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=3, spaceAfter=8))

    # SECCIÓN 4: MODELO DE INGRESOS
    elements.append(Paragraph("4. Modelo de Ingresos Recurrentes", h1_style))
    rev_data = [
        [
            Paragraph("<b>1. Cobro por Alta y Puesta en Marcha</b>", table_header_style),
            Paragraph("<b>2. Suscripción Mensual Recurrente</b>", table_header_style)
        ],
        [
            Paragraph("Se cobra una única vez al comercio.<br/>"
                      "<b>Incluye:</b><br/>"
                      "• Personalización de la app con el logo y colores del local.<br/>"
                      "• Asesoramiento para definir premios según ticket promedio.<br/>"
                      "• Entrega física del cartel acrílico con QR para mostrador.<br/>"
                      "• Capacitación presencial de 15 minutos en el local.", table_cell_style),
            Paragraph("Cuota mensual fija por el servicio en la nube.<br/>"
                      "<b>Incluye:</b><br/>"
                      "• Base de datos y analíticas de retención.<br/>"
                      "• Módulo de alerta y rescate de clientes por WhatsApp.<br/>"
                      "• Soporte técnico directo y prioritario.<br/>"
                      "• <b>Rentabilidad:</b> Con 2 a 3 comercios se cubren los costos y el resto es ganancia recurrente limpia.", table_cell_style)
        ]
    ]
    rev_table = Table(rev_data, colWidths=[265, 275])
    rev_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#e0f2fe')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#e0e7ff')),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor('#f0f9ff')),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor('#eef2ff')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(rev_table)
    elements.append(Spacer(1, 8))

    # SECCIÓN 5: PLAN MAESTRO EN 4 FASES
    elements.append(Paragraph("5. Plan Maestro de Ejecución (Hoja de Ruta en 4 Semanas)", h1_style))
    
    elements.append(Paragraph("<b>FASE 1 (Semana 1 - ACTUAL): Motor Núcleo y PWA</b>", ParagraphStyle('F1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, textColor=primary_color)))
    elements.append(Paragraph("• Cimientos listos: Landing comercial, PWA del cliente, ruleta de premios y mostrador de caja rápido.<br/>"
                              "• Integración del Loyalty Score (RFM) y segmentación automática de clientes (VIP vs. En Riesgo).", bullet_style))
    elements.append(Spacer(1, 4))

    elements.append(Paragraph("<b>FASE 2 (Semana 2): Panel Gerencial y Módulo de Rescate WhatsApp</b>", ParagraphStyle('F2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, textColor=primary_color)))
    elements.append(Paragraph("• Dashboard para el dueño con el reporte de clientes inactivos.<br/>"
                              "• Botón de envío directo por WhatsApp para rescatar clientes en riesgo.<br/>"
                              "• Contador de métrica 'Dinero Recuperado'.", bullet_style))
    elements.append(Spacer(1, 4))

    elements.append(Paragraph("<b>FASE 3 (Semana 3): Despliegue en la Nube con Costo $0</b>", ParagraphStyle('F3', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, textColor=primary_color)))
    elements.append(Paragraph("• Base de datos Supabase conectada con el esquema multi-comercio.<br/>"
                              "• Despliegue en Vercel con dominio público seguro (HTTPS). Enlace accesible desde cualquier celular.", bullet_style))
    elements.append(Spacer(1, 4))

    elements.append(Paragraph("<b>FASE 4 (Semana 4): Lanzamiento Piloto en Calle (Riesgo Cero)</b>", ParagraphStyle('F4', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, textColor=primary_color)))
    elements.append(Paragraph("• Imprimir 2 carteles acrílicos con código QR.<br/>"
                              "• Instalar el piloto gratuito durante 30 días en 2 comercios amigos (ej: 1 cafetería y 1 barbería/hamburguesería).<br/>"
                              "• Recoger testimonios y fotos reales para salir a vender al resto de la ciudad.", bullet_style))
    elements.append(Spacer(1, 10))

    # CONCLUSIÓN
    conc_data = [[Paragraph(
        "<b>CONCLUSIÓN Y DECISIÓN ESTRATÉGICA:</b> La propuesta une lo mejor del benchmark de SilverSeaCode con la visión psicológica de Starbucks sugerida por Carlos Rivas. La base técnica ya está construida y lista para probarse en local. El siguiente paso es conectar el panel gerencial de rescate de clientes y poner a prueba el primer mostrador piloto.",
        ParagraphStyle('Conc', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=colors.HexColor('#065f46'), alignment=1)
    )]]
    conc_table = Table(conc_data, colWidths=[540])
    conc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#d1fae5')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#059669')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(conc_table)

    doc.build(elements)
    print(f"PDF generado con éxito en: {filename}")

if __name__ == '__main__':
    target = os.path.join(os.getcwd(), 'Resumen_Ejecutivo_Sistema_Fidelizacion.pdf')
    create_executive_pdf(target)
