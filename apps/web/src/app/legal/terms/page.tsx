"use client";

import { LanguageToggle, useLegalLanguage } from "../legal-language-provider";

const content = {
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: March 18, 2026",
    intro: (
      <p>
        Welcome to <strong>Up Craft Crew</strong>. By accessing or using our application, you agree
        to these Terms of Service. Please read them carefully before using the service.
      </p>
    ),
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: (
          <p>
            By creating an account or using the Application, you agree to be bound by these Terms of
            Service and our <a href="/legal/privacy">Privacy Policy</a>. If you do not agree to
            these terms, do not use the Application.
          </p>
        ),
      },
      {
        title: "2. Description of Service",
        content: (
          <>
            <p>
              Up Craft Crew is a project management, budgeting, and team management platform. The
              Application allows you to:
            </p>
            <ul>
              <li>Manage projects and tasks;</li>
              <li>Create and track budgets;</li>
              <li>Manage clients and teams;</li>
              <li>Track finances and schedules;</li>
              <li>Collaborate with team members in real time.</li>
            </ul>
          </>
        ),
      },
      {
        title: "3. User Account",
        content: (
          <ul>
            <li>
              You are responsible for maintaining the confidentiality of your access credentials.
            </li>
            <li>You are responsible for all activities performed under your account.</li>
            <li>
              You must provide truthful and up-to-date information when creating your account.
            </li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
          </ul>
        ),
      },
      {
        title: "4. Acceptable Use",
        content: (
          <>
            <p>By using the Application, you agree not to:</p>
            <ul>
              <li>Violate any applicable law or regulation;</li>
              <li>Use the service for illegal or unauthorized purposes;</li>
              <li>Attempt to access other users&apos; accounts without authorization;</li>
              <li>Interfere with or disrupt the operation of the Application;</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Application;</li>
              <li>Transmit viruses, malware, or any malicious code.</li>
            </ul>
          </>
        ),
      },
      {
        title: "5. Intellectual Property",
        content: (
          <>
            <p>
              All content in the Application, including text, graphics, logos, icons, images, and
              software, is the property of Up Craft Crew and protected by intellectual property
              laws.
            </p>
            <p>
              The data and content you create within the Application remain your property. By using
              the Application, you grant us a limited license to store, process, and display such
              data as necessary to provide the service.
            </p>
          </>
        ),
      },
      {
        title: "6. Service Availability",
        content: (
          <p>
            We strive to keep the Application available and functioning, but we do not guarantee
            uninterrupted availability. The service may be temporarily unavailable due to
            maintenance, updates, or circumstances beyond our control.
          </p>
        ),
      },
      {
        title: "7. Limitation of Liability",
        content: (
          <p>
            To the maximum extent permitted by law, Up Craft Crew shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages resulting from the use
            or inability to use the Application.
          </p>
        ),
      },
      {
        title: "8. Termination",
        content: (
          <p>
            We may suspend or terminate your access to the Application at any time, with or without
            cause, with or without notice. You may terminate your account at any time by contacting
            us.
          </p>
        ),
      },
      {
        title: "9. Changes to Terms",
        content: (
          <p>
            We reserve the right to modify these Terms of Service at any time. Significant changes
            will be communicated through the Application or by email. Continued use of the
            Application after changes constitutes acceptance of the new terms.
          </p>
        ),
      },
      {
        title: "10. Governing Law",
        content: (
          <p>
            These Terms of Service are governed by the laws of the Federative Republic of Brazil.
            Any dispute shall be submitted to the jurisdiction of the user&apos;s domicile.
          </p>
        ),
      },
      {
        title: "11. Contact",
        content: (
          <>
            <p>If you have questions about these Terms of Service, please contact us:</p>
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
    title: "Termos de Uso",
    lastUpdated: "Última atualização: 18 de março de 2026",
    intro: (
      <p>
        Bem-vindo ao <strong>Up Craft Crew</strong>. Ao acessar ou utilizar nosso aplicativo, você
        concorda com estes Termos de Uso. Leia-os atentamente antes de utilizar o serviço.
      </p>
    ),
    sections: [
      {
        title: "1. Aceitação dos Termos",
        content: (
          <p>
            Ao criar uma conta ou utilizar o Aplicativo, você concorda em estar vinculado a estes
            Termos de Uso e à nossa <a href="/legal/privacy">Política de Privacidade</a>. Se você
            não concordar com estes termos, não utilize o Aplicativo.
          </p>
        ),
      },
      {
        title: "2. Descrição do Serviço",
        content: (
          <>
            <p>
              O Up Craft Crew é uma plataforma de gestão de projetos, orçamentos e equipes. O
              Aplicativo permite que você:
            </p>
            <ul>
              <li>Gerencie projetos e tarefas;</li>
              <li>Crie e acompanhe orçamentos;</li>
              <li>Gerencie clientes e equipes;</li>
              <li>Acompanhe finanças e cronogramas;</li>
              <li>Colabore com membros da equipe em tempo real.</li>
            </ul>
          </>
        ),
      },
      {
        title: "3. Conta do Usuário",
        content: (
          <ul>
            <li>
              Você é responsável por manter a confidencialidade de suas credenciais de acesso.
            </li>
            <li>Você é responsável por todas as atividades realizadas em sua conta.</li>
            <li>Você deve fornecer informações verdadeiras e atualizadas ao criar sua conta.</li>
            <li>
              Você deve nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.
            </li>
          </ul>
        ),
      },
      {
        title: "4. Uso Aceitável",
        content: (
          <>
            <p>Ao utilizar o Aplicativo, você concorda em não:</p>
            <ul>
              <li>Violar qualquer lei ou regulamento aplicável;</li>
              <li>Utilizar o serviço para fins ilegais ou não autorizados;</li>
              <li>Tentar acessar contas de outros usuários sem autorização;</li>
              <li>Interferir ou interromper o funcionamento do Aplicativo;</li>
              <li>
                Realizar engenharia reversa, descompilar ou desmontar qualquer parte do Aplicativo;
              </li>
              <li>Transmitir vírus, malware ou qualquer código malicioso.</li>
            </ul>
          </>
        ),
      },
      {
        title: "5. Propriedade Intelectual",
        content: (
          <>
            <p>
              Todo o conteúdo do Aplicativo, incluindo textos, gráficos, logotipos, ícones, imagens
              e software, é de propriedade da Up Craft Crew e protegido por leis de propriedade
              intelectual.
            </p>
            <p>
              Os dados e conteúdos que você cria dentro do Aplicativo permanecem de sua propriedade.
              Ao usar o Aplicativo, você nos concede uma licença limitada para armazenar, processar
              e exibir esses dados conforme necessário para fornecer o serviço.
            </p>
          </>
        ),
      },
      {
        title: "6. Disponibilidade do Serviço",
        content: (
          <p>
            Nos esforçamos para manter o Aplicativo disponível e funcionando, mas não garantimos
            disponibilidade ininterrupta. O serviço pode ser temporariamente indisponível devido a
            manutenção, atualizações ou circunstâncias além do nosso controle.
          </p>
        ),
      },
      {
        title: "7. Limitação de Responsabilidade",
        content: (
          <p>
            Na extensão máxima permitida por lei, a Up Craft Crew não será responsável por quaisquer
            danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso
            ou incapacidade de uso do Aplicativo.
          </p>
        ),
      },
      {
        title: "8. Rescisão",
        content: (
          <p>
            Podemos suspender ou encerrar seu acesso ao Aplicativo a qualquer momento, com ou sem
            motivo, com ou sem aviso prévio. Você pode encerrar sua conta a qualquer momento
            entrando em contato conosco.
          </p>
        ),
      },
      {
        title: "9. Alterações nos Termos",
        content: (
          <p>
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações
            significativas serão comunicadas através do Aplicativo ou por e-mail. O uso continuado
            do Aplicativo após as alterações constitui aceitação dos novos termos.
          </p>
        ),
      },
      {
        title: "10. Lei Aplicável",
        content: (
          <p>
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer
            disputa será submetida ao foro da comarca do domicílio do usuário.
          </p>
        ),
      },
      {
        title: "11. Contato",
        content: (
          <>
            <p>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:</p>
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

export default function TermsOfServicePage() {
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
