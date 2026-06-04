import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — JTC Store" },
      { name: "description", content: "Política de Privacidade da JTC Store. Saiba como coletamos, usamos e protegemos seus dados pessoais." },
    ],
  }),
  component: PrivacidadePage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function PrivacidadePage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      subtitle="JTC Store / Privacidade"
    >
      <Section title="1. Introdução">
        <p>
          A JTC Store respeita a sua privacidade e está comprometida em proteger os dados pessoais dos usuários que acessam nossa plataforma. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você utiliza nossos serviços.
        </p>
        <p>
          Nossa plataforma disponibiliza aplicativos, jogos e livros digitais. Parte desse conteúdo é desenvolvido diretamente pela JTC ("Conteúdo Próprio"), enquanto outra parte é disponibilizada por desenvolvedores e editoras parceiras ("Conteúdo de Terceiros"), que a JTC repassa em nosso catálogo. Independentemente da origem do conteúdo, nosso compromisso com a privacidade dos dados dos usuários permanece o mesmo.
        </p>
      </Section>

      <Section title="2. Dados que Coletamos">
        <p>Podemos coletar os seguintes tipos de dados pessoais:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Dados de cadastro:</strong> nome, endereço de e-mail e informações de conta criadas em nossa plataforma;</li>
          <li><strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo, sistema operacional, versão do aplicativo e logs de acesso;</li>
          <li><strong>Dados de uso:</strong> histórico de downloads, preferências de conteúdo, interações com o catálogo e avaliações;</li>
          <li><strong>Dados de comunicação:</strong> mensagens enviadas através de canais de suporte e feedback;</li>
          <li><strong>Dados de transação:</strong> registros de aquisições, quando aplicável.</li>
        </ul>
      </Section>

      <Section title="3. Finalidade do Uso dos Dados">
        <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Gerenciar sua conta de usuário e permitir o acesso aos conteúdos da plataforma;</li>
          <li>Processar downloads, atualizações e ativações de aplicativos, jogos e livros;</li>
          <li>Personalizar recomendações de conteúdo com base em seus interesses;</li>
          <li>Comunicar-se sobre atualizações, novidades, promoções e mudanças nos termos;</li>
          <li>Melhorar nossos serviços, corrigir erros e desenvolver novas funcionalidades;</li>
          <li>Garantir a segurança da plataforma, prevenir fraudes e abusos;</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
      </Section>

      <Section title="4. Cookies e Tecnologias de Rastreamento">
        <p>
          Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, lembrar preferências, entender como você interage com nossa plataforma e personalizar o conteúdo exibido.
        </p>
        <p>
          Os cookies podem ser categorizados como essenciais (necessários para o funcionamento da plataforma), de preferências (lembram suas configurações), analíticos (ajudam a entender o uso da plataforma) e de marketing (quando utilizados para comunicações promocionais).
        </p>
        <p>
          Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. No entanto, desativar cookies essenciais pode comprometer o funcionamento de parte dos nossos serviços.
        </p>
      </Section>

      <Section title="5. Compartilhamento de Dados">
        <p>
          A JTC Store não vende seus dados pessoais. Compartilhamos informações apenas nas seguintes situações:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Com terceiros prestadores de serviço:</strong> empresas que auxiliam na operação da plataforma, como hospedagem, análise de dados e processamento de pagamentos, sempre sob contratos que garantem a proteção dos dados;</li>
          <li><strong>Com desenvolvedores parceiros:</strong> quando você adquire ou utiliza Conteúdo de Terceiros, podemos compartilhar dados mínimos necessários (como identificação de ativação) com o respectivo parceiro, sempre conforme autorização legal;</li>
          <li><strong>Por obrigação legal:</strong> quando exigido por lei, decisão judicial ou solicitação de autoridade competente;</li>
          <li><strong>Em caso de reorganização societária:</strong> fusões, aquisições ou vendas de ativos, sempre com proteção contratual dos dados.</li>
        </ul>
      </Section>

      <Section title="6. Segurança da Informação">
        <p>
          Adotamos medidas técnicas e administrativas adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia em trânsito e em repouso, controles de acesso, monitoramento contínuo e auditorias de segurança.
        </p>
        <p>
          Apesar dos nossos esforços, nenhum sistema é completamente invulnerável. Caso identifiquemos qualquer incidente de segurança que possa afetar seus dados, notificaremos você e as autoridades competentes conforme exigido pela legislação aplicável.
        </p>
      </Section>

      <Section title="7. Seus Direitos (LGPD)">
        <p>
          De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você possui os seguintes direitos em relação aos seus dados pessoais:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Confirmar a existência de tratamento dos seus dados;</li>
          <li>Acessar seus dados pessoais que mantemos;</li>
          <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;</li>
          <li>Solicitar a portabilidade dos dados para outro fornecedor de serviço;</li>
          <li>Revogar seu consentimento a qualquer momento, quando o tratamento se basear nele;</li>
          <li>Solicitar informações sobre entidades com as quais compartilhamos seus dados;</li>
          <li>Opor-se a tratamentos realizados com fundamento em interesse legítimo.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato conosco pelos canais indicados na seção "Contato" desta política. Responderemos às solicitações no prazo estabelecido pela legislação.
        </p>
      </Section>

      <Section title="8. Retenção e Exclusão de Dados">
        <p>
          Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados, atender a obrigações legais e resolver disputas. Quando os dados não forem mais necessários, procederemos à sua exclusão ou anonimização de forma segura.
        </p>
        <p>
          Caso você solicite a exclusão da sua conta, poderemos reter informações mínimas necessárias para cumprir obrigações legais, resolver litígios, prevenir fraudes ou fazer cumprir nossos termos.
        </p>
      </Section>

      <Section title="9. Transferência Internacional de Dados">
        <p>
          Nossa infraestrutura de tecnologia pode envolver o processamento de dados em servidores localizados fora do Brasil. Quando ocorrer transferência internacional, adotamos as salvaguardas adequadas previstas na LGPD, incluindo cláusulas contratuais específicas e a verificação de que o país de destino oferece nível de proteção adequado.
        </p>
      </Section>

      <Section title="10. Alterações nesta Política">
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas, na legislação ou na operação da plataforma. Notificaremos você sobre alterações significativas por meio de avisos na plataforma ou por e-mail. O uso continuado dos serviços após a publicação das alterações constitui aceitação da política revisada.
        </p>
      </Section>

      <Section title="11. Contato e Encarregado de Dados">
        <p>
          Se tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento dos seus dados pessoais, entre em contato conosco:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>E-mail:</strong> privacidade@jtcstore.com.br</li>
          <li><strong>Endereço:</strong> Avenida Paulista, 0000, São Paulo/SP — CEP 01310-100</li>
        </ul>
        <p>
          Nosso Encarregado de Proteção de Dados (DPO) está disponível para atender demandas relacionadas à LGPD e garantir que seus direitos sejam respeitados.
        </p>
      </Section>

      <div className="pt-4 text-xs text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </LegalLayout>
  );
}
