/* =====================================================
   SCHEMA.JS — JSON-LD Dinâmico
   Gera BreadcrumbList + schemas contextuais por página
   ===================================================== */
(function () {
  const SITE = {
    url:    'https://www.arthurvasconcelos.adv.br',
    name:   'Advogado Trabalhista Uberlândia',
    phone:  '+55-34-98432-1800',
    email:  'arthurvasconcelosadv@gmail.com',
    lawyer: 'Dr. Arthur Vasconcelos Fernandes',
    oab:    'OAB/SP 478.920',
    addr: {
      street: 'Av. João Pinheiro, 100, Sala 201',
      city: 'Uberlândia', state: 'MG', zip: '38400-100', country: 'BR'
    },
    geo: { lat: -18.9186, lng: -48.2772 }
  };

  function inject(data) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  function breadcrumb() {
    const path = window.location.pathname.replace(/index\.html$/, '');
    const items = [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url + '/' }];
    let pos = 2;

    const labels = {
      '/sobre.html':                   'Sobre o Advogado',
      '/contato.html':                 'Contato',
      '/uberlandia.html':              'Advogado em Uberlândia',
      '/online.html':                  'Atendimento Online',
      '/privacidade.html':             'Política de Privacidade',
      '/blog.html':                        'Blog Jurídico',
      '/blog.html':              'Blog Jurídico',
      '/rescisao-indireta.html':  'Rescisão Indireta',
      '/blog-insalubridade.html':      'Insalubridade',
      '/assedio-moral.html':      'Assédio Moral',
      '/acidente-trabalho.html':  'Acidente de Trabalho',
      '/horas-extras.html':       'Horas Extras',
      '/insalubridade.html':     'Insalubridade e Periculosidade',
      '/demissao.html':          'Demissão e Rescisão Indireta',
      '/jornada.html':           'Jornada de Trabalho',
      '/assedio.html':           'Assédio Moral no Trabalho',
      '/acidente.html':          'Acidente de Trabalho',
    };

    if (path.includes('/blog.html') && !path.endsWith('/blog.html')) {
      items.push({ '@type': 'ListItem', position: pos++, name: 'Blog Jurídico', item: SITE.url + '/blog.html' });
    }
    if (path.includes('/areas/')) {
      items.push({ '@type': 'ListItem', position: pos++, name: 'Áreas de Atuação', item: SITE.url + '/#areas' });
    }

    const label = labels[path];
    if (label) items.push({ '@type': 'ListItem', position: pos, name: label, item: SITE.url + path });

    if (items.length > 1) inject({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items });
  }

  function legalService() {
    inject({
      '@context': 'https://schema.org',
      '@type': ['LegalService', 'LocalBusiness'],
      '@id': SITE.url + '/#org',
      name: SITE.name,
      description: 'Escritório de advocacia especializado em direito do trabalho. Atendimento presencial em Uberlândia/MG e online para todo o Brasil.',
      url: SITE.url, telephone: SITE.phone, email: SITE.email, priceRange: 'Consulta Gratuita',
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.addr.street, addressLocality: SITE.addr.city,
        addressRegion: SITE.addr.state, postalCode: SITE.addr.zip, addressCountry: SITE.addr.country
      },
      geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' }],
      areaServed: [{ '@type': 'City', name: 'Uberlândia' }, { '@type': 'Country', name: 'Brasil' }],
      sameAs: [
        'https://www.instagram.com/vf.arthur',
        'https://www.tiktok.com/@vf.arthur',
        
      ]
    });
  }

  function pageSchema() {
    const path = window.location.pathname;

    // Sobre → Person
    if (path.includes('/sobre')) {
      inject({
        '@context': 'https://schema.org', '@type': 'Person',
        name: SITE.lawyer, jobTitle: 'Advogado Trabalhista',
        url: SITE.url + '/sobre.html', telephone: SITE.phone, email: SITE.email,
        worksFor: { '@type': 'LegalService', name: SITE.name, url: SITE.url },
        knowsAbout: ['Direito do Trabalho','Rescisão Indireta','Insalubridade','Assédio Moral','Acidente de Trabalho','Horas Extras']
      });
    }

    // Artigos do Blog → Article
    const arts = {
      'rescisao-indireta': 'Quando Cabe Rescisão Indireta? Guia Completo',
      'insalubridade':     'Quem tem Direito à Insalubridade? Guia Completo',
      'assedio-moral':     'Assédio Moral no Trabalho: Como Provar?',
      'acidente-trabalho': 'Direitos em Caso de Acidente de Trabalho',
      'horas-extras':      'Quantas Horas Extras Posso Fazer? Tudo sobre a CLT',
    };
    const artKey = Object.keys(arts).find(k => path.includes(k));
    if (artKey) {
      inject({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: arts[artKey], datePublished: '2025-01-15', dateModified: '2025-01-15',
        author: { '@type': 'Person', name: SITE.lawyer, url: SITE.url + '/sobre.html' },
        publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        mainEntityOfPage: { '@type': 'WebPage', '@id': SITE.url + path },
        inLanguage: 'pt-BR'
      });
    }

    // Áreas → Service
    const svcs = {
      'insalubridade': 'Adicional de Insalubridade e Periculosidade',
      'demissao':      'Rescisão Indireta e Demissão sem Justa Causa',
      'jornada':       'Horas Extras e Jornada de Trabalho',
      'assedio':       'Assédio Moral no Trabalho',
      'acidente':      'Acidente de Trabalho',
    };
    const svcKey = Object.keys(svcs).find(k => path.includes('/areas/' + k));
    if (svcKey) {
      inject({
        '@context': 'https://schema.org', '@type': 'Service',
        name: svcs[svcKey], serviceType: 'Serviço Jurídico Trabalhista',
        provider: { '@type': 'LegalService', name: SITE.name, url: SITE.url },
        url: SITE.url + path
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    breadcrumb();
    legalService();
    pageSchema();
  });
})();
