"use client";

import { LanguageToggle, useLegalLanguage } from "../legal-language-provider";

const content = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: March 18, 2026",
    intro: (
      <p>
        <strong>Up Craft Crew</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;company&quot;)
        operates the <strong>Up Craft Crew</strong> application (hereinafter referred to as
        &quot;Application&quot;). This page informs you of our policies regarding the collection,
        use, and disclosure of personal information when you use our Application.
      </p>
    ),
    sections: [
      {
        title: "1. Information We Collect",
        content: (
          <>
            <h3>1.1 Information you provide</h3>
            <ul>
              <li>
                <strong>Registration data:</strong> name, email address, and profile picture when
                creating an account.
              </li>
              <li>
                <strong>Service usage data:</strong> information about projects, budgets, clients,
                and tasks you create and manage within the Application.
              </li>
            </ul>
            <h3>1.2 Information collected automatically</h3>
            <ul>
              <li>
                <strong>Device data:</strong> device model, operating system, unique identifiers,
                and mobile network data.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, features used, time of use, and browsing
                patterns.
              </li>
              <li>
                <strong>Log data:</strong> IP address, browser type, pages accessed, date and time
                of access.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "2. How We Use Your Information",
        content: (
          <>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide, maintain, and improve the Application;</li>
              <li>Authenticate your identity and manage your account;</li>
              <li>Send service-related notifications;</li>
              <li>Respond to support requests;</li>
              <li>Analyze Application usage for improvements;</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </>
        ),
      },
      {
        title: "3. Information Sharing",
        content: (
          <>
            <p>
              We do not sell, rent, or share your personal information with third parties, except in
              the following situations:
            </p>
            <ul>
              <li>
                <strong>Service providers:</strong> we share data with service providers who assist
                us in operating the Application (such as authentication, hosting, and data storage),
                subject to confidentiality obligations.
              </li>
              <li>
                <strong>Legal requirements:</strong> we may disclose information when required by
                law, court order, or legal process.
              </li>
              <li>
                <strong>Protection of rights:</strong> when necessary to protect our rights, safety,
                or property.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "4. Third-Party Services",
        content: (
          <>
            <p>The Application uses the following third-party services:</p>
            <ul>
              <li>
                <strong>Clerk:</strong> for authentication and identity management.
              </li>
              <li>
                <strong>Convex:</strong> for real-time data storage and synchronization.
              </li>
              <li>
                <strong>Google Play Services:</strong> for application distribution and updates.
              </li>
            </ul>
            <p>Each of these services has its own privacy policy governing the use of your data.</p>
          </>
        ),
      },
      {
        title: "5. Data Storage and Security",
        content: (
          <>
            <p>
              Your data is stored on secure servers with encryption in transit and at rest. We
              implement technical and organizational security measures to protect your information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              However, no method of Internet transmission or electronic storage is 100% secure.
              While we strive to protect your information, we cannot guarantee its absolute
              security.
            </p>
          </>
        ),
      },
      {
        title: "6. Your Rights (LGPD)",
        content: (
          <>
            <p>
              In compliance with the Brazilian General Data Protection Law (LGPD - Law No.
              13,709/2018), you have the right to:
            </p>
            <ul>
              <li>Confirm the existence of data processing;</li>
              <li>Access your personal data;</li>
              <li>Correct incomplete, inaccurate, or outdated data;</li>
              <li>Request anonymization, blocking, or deletion of unnecessary data;</li>
              <li>Request data portability;</li>
              <li>Revoke consent at any time;</li>
              <li>Request deletion of your personal data.</li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Data Retention",
        content: (
          <>
            <p>
              We retain your personal information only for as long as necessary to fulfill the
              purposes described in this policy, unless a longer retention period is required or
              permitted by law.
            </p>
            <p>
              When you delete your account, your personal data will be removed from our systems
              within 30 days, except when retention is necessary for compliance with legal
              obligations.
            </p>
          </>
        ),
      },
      {
        title: "8. Children",
        content: (
          <p>
            The Application is not intended for children under 13 years of age. We do not knowingly
            collect personal information from children under 13. If we become aware that we have
            collected data from a child under 13, we will take steps to delete that information.
          </p>
        ),
      },
      {
        title: "9. Changes to This Policy",
        content: (
          <>
            <p>
              We may update this Privacy Policy periodically. We will notify you of any changes by
              posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p>
              We recommend that you review this policy periodically to stay informed about how we
              protect your information.
            </p>
          </>
        ),
      },
      {
        title: "10. Contact",
        content: (
          <>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights,
              please contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:contato@upcraftcrew.com">contato@upcraftcrew.com</a>
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a href="https://upcraftcrew.com" target="_blank" rel="noopener noreferrer">
                  upcraftcrew.com
                </a>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  pt: {
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: 18 de março de 2026",
    intro: (
      <p>
        A <strong>Up Craft Crew</strong> (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;)
        opera o aplicativo <strong>Up Craft Crew</strong> (doravante referido como
        &quot;Aplicativo&quot;). Esta página informa sobre nossas políticas relativas à coleta, uso
        e divulgação de informações pessoais quando você utiliza nosso Aplicativo.
      </p>
    ),
    sections: [
      {
        title: "1. Informações que Coletamos",
        content: (
          <>
            <h3>1.1 Informações fornecidas por você</h3>
            <ul>
              <li>
                <strong>Dados de cadastro:</strong> nome, endereço de e-mail e foto de perfil ao
                criar uma conta.
              </li>
              <li>
                <strong>Dados de uso do serviço:</strong> informações sobre projetos, orçamentos,
                clientes e tarefas que você cria e gerencia dentro do Aplicativo.
              </li>
            </ul>
            <h3>1.2 Informações coletadas automaticamente</h3>
            <ul>
              <li>
                <strong>Dados do dispositivo:</strong> modelo do dispositivo, sistema operacional,
                identificadores únicos e dados de rede móvel.
              </li>
              <li>
                <strong>Dados de uso:</strong> páginas visitadas, funcionalidades utilizadas, tempo
                de uso e padrões de navegação.
              </li>
              <li>
                <strong>Dados de log:</strong> endereço IP, tipo de navegador, páginas acessadas,
                data e hora de acesso.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "2. Como Usamos Suas Informações",
        content: (
          <>
            <p>Utilizamos as informações coletadas para:</p>
            <ul>
              <li>Fornecer, manter e melhorar o Aplicativo;</li>
              <li>Autenticar sua identidade e gerenciar sua conta;</li>
              <li>Enviar notificações relacionadas ao serviço;</li>
              <li>Responder a solicitações de suporte;</li>
              <li>Analisar o uso do Aplicativo para melhorias;</li>
              <li>Cumprir obrigações legais.</li>
            </ul>
          </>
        ),
      },
      {
        title: "3. Compartilhamento de Informações",
        content: (
          <>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros,
              exceto nas seguintes situações:
            </p>
            <ul>
              <li>
                <strong>Provedores de serviço:</strong> compartilhamos dados com prestadores de
                serviço que nos auxiliam na operação do Aplicativo (como autenticação, hospedagem e
                armazenamento de dados), sujeitos a obrigações de confidencialidade.
              </li>
              <li>
                <strong>Requisitos legais:</strong> podemos divulgar informações quando exigido por
                lei, ordem judicial ou processo legal.
              </li>
              <li>
                <strong>Proteção de direitos:</strong> quando necessário para proteger nossos
                direitos, segurança ou propriedade.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "4. Serviços de Terceiros",
        content: (
          <>
            <p>O Aplicativo utiliza os seguintes serviços de terceiros:</p>
            <ul>
              <li>
                <strong>Clerk:</strong> para autenticação e gerenciamento de identidade.
              </li>
              <li>
                <strong>Convex:</strong> para armazenamento e sincronização de dados em tempo real.
              </li>
              <li>
                <strong>Google Play Services:</strong> para distribuição e atualizações do
                aplicativo.
              </li>
            </ul>
            <p>
              Cada um desses serviços possui sua própria política de privacidade que governa o uso
              dos seus dados.
            </p>
          </>
        ),
      },
      {
        title: "5. Armazenamento e Segurança dos Dados",
        content: (
          <>
            <p>
              Seus dados são armazenados em servidores seguros com criptografia em trânsito e em
              repouso. Implementamos medidas de segurança técnicas e organizacionais para proteger
              suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
            <p>
              No entanto, nenhum método de transmissão pela Internet ou método de armazenamento
              eletrônico é 100% seguro. Embora nos esforcemos para proteger suas informações, não
              podemos garantir sua segurança absoluta.
            </p>
          </>
        ),
      },
      {
        title: "6. Seus Direitos (LGPD)",
        content: (
          <>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), você
              tem direito a:
            </p>
            <ul>
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Acessar seus dados pessoais;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Solicitar a portabilidade dos dados;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Solicitar a exclusão de seus dados pessoais.</li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Retenção de Dados",
        content: (
          <>
            <p>
              Retemos suas informações pessoais apenas pelo tempo necessário para cumprir as
              finalidades descritas nesta política, a menos que um período de retenção mais longo
              seja exigido ou permitido por lei.
            </p>
            <p>
              Ao excluir sua conta, seus dados pessoais serão removidos de nossos sistemas em até 30
              dias, exceto quando a retenção for necessária para cumprimento de obrigações legais.
            </p>
          </>
        ),
      },
      {
        title: "8. Menores de Idade",
        content: (
          <p>
            O Aplicativo não se destina a menores de 13 anos. Não coletamos intencionalmente
            informações pessoais de crianças menores de 13 anos. Se tomarmos conhecimento de que
            coletamos dados de uma criança menor de 13 anos, tomaremos medidas para excluir essas
            informações.
          </p>
        ),
      },
      {
        title: "9. Alterações nesta Política",
        content: (
          <>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre
              quaisquer alterações publicando a nova política nesta página e atualizando a data de
              &quot;Última atualização&quot;.
            </p>
            <p>
              Recomendamos que você revise esta política periodicamente para se manter informado
              sobre como protegemos suas informações.
            </p>
          </>
        ),
      },
      {
        title: "10. Contato",
        content: (
          <>
            <p>
              Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus
              direitos, entre em contato conosco:
            </p>
            <ul>
              <li>
                <strong>E-mail:</strong>{" "}
                <a href="mailto:contato@upcraftcrew.com">contato@upcraftcrew.com</a>
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a href="https://upcraftcrew.com" target="_blank" rel="noopener noreferrer">
                  upcraftcrew.com
                </a>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  const { lang } = useLegalLanguage();
  const t = content[lang];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div />
        <LanguageToggle />
      </div>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{t.title}</h1>
        <p className="lead">{t.lastUpdated}</p>
        {t.intro}
        {t.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.content}
          </section>
        ))}
      </article>
    </div>
  );
}
