import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Up Craft Crew",
  description: "Termos de Uso do aplicativo Up Craft Crew",
};

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Termos de Uso</h1>
      <p className="lead">Última atualização: 18 de março de 2026</p>

      <p>
        Bem-vindo ao <strong>Up Craft Crew</strong>. Ao acessar ou utilizar nosso
        aplicativo, você concorda com estes Termos de Uso. Leia-os atentamente antes de
        utilizar o serviço.
      </p>

      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao criar uma conta ou utilizar o Aplicativo, você concorda em estar vinculado a
        estes Termos de Uso e à nossa{" "}
        <a href="/legal/privacy">Política de Privacidade</a>. Se você não concordar com
        estes termos, não utilize o Aplicativo.
      </p>

      <h2>2. Descrição do Serviço</h2>
      <p>
        O Up Craft Crew é uma plataforma de gestão de projetos, orçamentos e equipes.
        O Aplicativo permite que você:
      </p>
      <ul>
        <li>Gerencie projetos e tarefas;</li>
        <li>Crie e acompanhe orçamentos;</li>
        <li>Gerencie clientes e equipes;</li>
        <li>Acompanhe finanças e cronogramas;</li>
        <li>Colabore com membros da equipe em tempo real.</li>
      </ul>

      <h2>3. Conta do Usuário</h2>
      <ul>
        <li>
          Você é responsável por manter a confidencialidade de suas credenciais de
          acesso.
        </li>
        <li>
          Você é responsável por todas as atividades realizadas em sua conta.
        </li>
        <li>
          Você deve fornecer informações verdadeiras e atualizadas ao criar sua conta.
        </li>
        <li>
          Você deve nos notificar imediatamente sobre qualquer uso não autorizado de sua
          conta.
        </li>
      </ul>

      <h2>4. Uso Aceitável</h2>
      <p>Ao utilizar o Aplicativo, você concorda em não:</p>
      <ul>
        <li>Violar qualquer lei ou regulamento aplicável;</li>
        <li>
          Utilizar o serviço para fins ilegais ou não autorizados;
        </li>
        <li>
          Tentar acessar contas de outros usuários sem autorização;
        </li>
        <li>
          Interferir ou interromper o funcionamento do Aplicativo;
        </li>
        <li>
          Realizar engenharia reversa, descompilar ou desmontar qualquer parte do
          Aplicativo;
        </li>
        <li>
          Transmitir vírus, malware ou qualquer código malicioso.
        </li>
      </ul>

      <h2>5. Propriedade Intelectual</h2>
      <p>
        Todo o conteúdo do Aplicativo, incluindo textos, gráficos, logotipos, ícones,
        imagens e software, é de propriedade da Up Craft Crew e protegido por leis de
        propriedade intelectual.
      </p>
      <p>
        Os dados e conteúdos que você cria dentro do Aplicativo permanecem de sua
        propriedade. Ao usar o Aplicativo, você nos concede uma licença limitada para
        armazenar, processar e exibir esses dados conforme necessário para fornecer o
        serviço.
      </p>

      <h2>6. Disponibilidade do Serviço</h2>
      <p>
        Nos esforçamos para manter o Aplicativo disponível e funcionando, mas não
        garantimos disponibilidade ininterrupta. O serviço pode ser temporariamente
        indisponível devido a manutenção, atualizações ou circunstâncias além do nosso
        controle.
      </p>

      <h2>7. Limitação de Responsabilidade</h2>
      <p>
        Na extensão máxima permitida por lei, a Up Craft Crew não será responsável por
        quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos
        resultantes do uso ou incapacidade de uso do Aplicativo.
      </p>

      <h2>8. Rescisão</h2>
      <p>
        Podemos suspender ou encerrar seu acesso ao Aplicativo a qualquer momento, com
        ou sem motivo, com ou sem aviso prévio. Você pode encerrar sua conta a qualquer
        momento entrando em contato conosco.
      </p>

      <h2>9. Alterações nos Termos</h2>
      <p>
        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento.
        Alterações significativas serão comunicadas através do Aplicativo ou por e-mail.
        O uso continuado do Aplicativo após as alterações constitui aceitação dos novos
        termos.
      </p>

      <h2>10. Lei Aplicável</h2>
      <p>
        Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.
        Qualquer disputa será submetida ao foro da comarca do domicílio do usuário.
      </p>

      <h2>11. Contato</h2>
      <p>
        Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
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
    </article>
  );
}
