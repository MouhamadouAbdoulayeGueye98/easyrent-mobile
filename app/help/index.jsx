import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { api } from "../../services/api";

const FAQ_DATA = [
  {
    category: "Compte",
    icon: "person-circle-outline",
    question: "Comment créer un compte Easy Rent ?",
    answer:
      "Accédez à la page de connexion, choisissez l'inscription et renseignez les informations demandées. Une fois votre compte créé, vous pourrez accéder aux fonctionnalités de Easy Rent.",
  },
  {
    category: "Compte",
    icon: "lock-closed-outline",
    question: "Comment modifier mes informations personnelles ?",
    answer:
      "Rendez-vous dans votre profil pour accéder à la gestion de votre compte. Vous pourrez modifier les informations proposées par votre application.",
  },
  {
    category: "Logements",
    icon: "home-outline",
    question: "Comment rechercher un logement ?",
    answer:
      "Depuis l'accueil, consultez les annonces disponibles. Vous pouvez explorer les logements et utiliser les critères de recherche pour trouver celui qui vous correspond.",
  },
  {
    category: "Logements",
    icon: "heart-outline",
    question: "Comment ajouter un logement aux favoris ?",
    answer:
      "Ouvrez une annonce et appuyez sur l'icône en forme de cœur. Vous retrouverez ensuite le logement dans la rubrique Mes favoris.",
  },
  {
    category: "Visites",
    icon: "calendar-outline",
    question: "Comment demander une visite ?",
    answer:
      "Ouvrez la fiche d'un logement et utilisez l'option de demande de visite si elle est disponible. Vous pourrez ensuite suivre votre demande dans Mes visites.",
  },
  {
    category: "Visites",
    icon: "checkmark-circle-outline",
    question: "Comment suivre ma demande de visite ?",
    answer:
      "Accédez à Mes visites depuis votre profil. Vous pourrez consulter le statut de vos demandes et les informations disponibles.",
  },
  {
    category: "Messages",
    icon: "chatbubble-outline",
    question: "Comment contacter un propriétaire ?",
    answer:
      "Utilisez la messagerie de Easy Rent pour échanger avec l'annonceur lorsque cette fonctionnalité est disponible sur l'annonce.",
  },
  {
    category: "Publication",
    icon: "add-circle-outline",
    question: "Comment publier un logement ?",
    answer:
      "Connectez-vous avec votre compte propriétaire et accédez à l'espace de publication. Renseignez les caractéristiques du logement, ajoutez les photos et les informations demandées.",
  },
];

const CATEGORIES = [
  "Tout",
  "Compte",
  "Logements",
  "Visites",
  "Messages",
  "Publication",
];

export default function HelpScreen() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeGuide, setActiveGuide] = useState("locataire");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "Tout" || item.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        item.question.toLowerCase().includes(searchText) ||
        item.answer.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleContact = async () => {
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanSubject || !cleanMessage) {
      Alert.alert(
        "Informations manquantes",
        "Veuillez renseigner le sujet et décrire votre demande.",
      );
      return;
    }

    if (cleanMessage.length < 10) {
      Alert.alert(
        "Message trop court",
        "Votre message doit contenir au moins 10 caractères.",
      );
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await api.post("/support", {
        subject: cleanSubject,
        message: cleanMessage,
      });

      setSubject("");
      setMessage("");

      await fetchTickets();

      Alert.alert(
        "Demande envoyée !",
        response.data?.message ||
          "Votre demande a bien été enregistrée. Notre équipe vous répondra dès que possible.",
      );
    } catch (error) {
      console.error(
        "Erreur envoi support :",
        error.response?.data || error.message,
      );

      const serverMessage = error.response?.data?.message;

      Alert.alert(
        "Envoi impossible",
        Array.isArray(serverMessage)
          ? serverMessage.join("\n")
          : serverMessage ||
              "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
      OPEN: {
        label: "En attente",
        color: "#D97706",
        background: "#FEF3C7",
        icon: "time-outline",
      },
      IN_PROGRESS: {
        label: "En cours",
        color: "#2563EB",
        background: "#DBEAFE",
        icon: "sync-outline",
      },
      RESOLVED: {
        label: "Résolu",
        color: "#059669",
        background: "#D1FAE5",
        icon: "checkmark-circle-outline",
      },
      CLOSED: {
        label: "Fermé",
        color: "#64748B",
        background: "#E2E8F0",
        icon: "close-circle-outline",
      },
    };

    return statuses[status] || statuses.OPEN;
  };

  const formatTicketDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const toggleFaq = (index) => {
    setExpandedFaq((previous) => (previous === index ? null : index));
  }; 


  const fetchTickets = useCallback(async () => {
    try {
      setLoadingTickets(true);

      const response = await api.get("/support/my-tickets");

      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(
        "Erreur récupération tickets :",
        error.response?.data || error.message,
      );
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const GuideItem = ({ icon, title, description, color }) => (
    <View style={styles.guideItem}>
      <View style={[styles.guideIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <View style={styles.guideText}>
        <Text style={styles.guideTitle}>{title}</Text>
        <Text style={styles.guideDescription}>{description}</Text>
      </View>
    </View>


  );

  

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={23} color="#1E293B" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Aide et assistance</Text>
            <Text style={styles.headerSubtitle}>
              Nous sommes là pour vous accompagner
            </Text>
          </View>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="headset-outline" size={34} color="#FFFFFF" />
          </View>

          <Text style={styles.heroTitle}>
            Comment pouvons-nous vous aider ?
          </Text>

          <Text style={styles.heroDescription}>
            Trouvez rapidement une réponse à vos questions ou contactez notre
            équipe.
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={21} color="#94A3B8" />

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une question..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Questions fréquentes</Text>
              <Text style={styles.sectionSubtitle}>
                Les réponses aux questions les plus posées
              </Text>
            </View>

            <View style={styles.faqBadge}>
              <Text style={styles.faqBadgeText}>{filteredFaq.length}</Text>
            </View>
          </View>

          {/* CATEGORIES */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    active && styles.categoryButtonActive,
                  ]}
                  onPress={() => {
                    setActiveCategory(category);
                    setExpandedFaq(null);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      active && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* FAQ ITEMS */}
          <View style={styles.faqList}>
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item, index) => {
                const expanded = expandedFaq === index;

                return (
                  <TouchableOpacity
                    key={item.question}
                    activeOpacity={0.8}
                    style={styles.faqItem}
                    onPress={() => toggleFaq(index)}
                  >
                    <View style={styles.faqQuestion}>
                      <View style={styles.faqQuestionText}>
                        <Text style={styles.faqTitle}>{item.question}</Text>
                      </View>

                      <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#64748B"
                      />
                    </View>

                    {expanded && (
                      <View style={styles.faqAnswerContainer}>
                        <View style={styles.faqAnswerLine} />
                        <Text style={styles.faqAnswer}>{item.answer}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={35} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Aucun résultat</Text>
                <Text style={styles.emptyDescription}>
                  Essayez un autre mot-clé ou une autre catégorie.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* GUIDE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guide d'utilisation</Text>
          <Text style={styles.sectionSubtitle}>
            Découvrez comment utiliser Easy Rent
          </Text>

          <View style={styles.guideTabs}>
            <TouchableOpacity
              style={[
                styles.guideTab,
                activeGuide === "locataire" && styles.guideTabActive,
              ]}
              onPress={() => setActiveGuide("locataire")}
            >
              <Ionicons
                name="person-outline"
                size={17}
                color={activeGuide === "locataire" ? "#FFFFFF" : "#64748B"}
              />
              <Text
                style={[
                  styles.guideTabText,
                  activeGuide === "locataire" && styles.guideTabTextActive,
                ]}
              >
                Locataire
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.guideTab,
                activeGuide === "proprietaire" && styles.guideTabActive,
              ]}
              onPress={() => setActiveGuide("proprietaire")}
            >
              <Ionicons
                name="home-outline"
                size={17}
                color={activeGuide === "proprietaire" ? "#FFFFFF" : "#64748B"}
              />
              <Text
                style={[
                  styles.guideTabText,
                  activeGuide === "proprietaire" && styles.guideTabTextActive,
                ]}
              >
                Propriétaire
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guideCard}>
            {activeGuide === "locataire" ? (
              <>
                <GuideItem
                  icon="search-outline"
                  title="1. Trouver un logement"
                  description="Explorez les annonces et utilisez les filtres pour trouver votre futur logement."
                  color="#2563EB"
                />
                <GuideItem
                  icon="heart-outline"
                  title="2. Enregistrer vos favoris"
                  description="Gardez vos logements préférés pour les retrouver facilement."
                  color="#E11D48"
                />
                <GuideItem
                  icon="calendar-outline"
                  title="3. Demander une visite"
                  description="Envoyez une demande de visite pour découvrir un logement."
                  color="#0D9488"
                />
                <GuideItem
                  icon="chatbubble-outline"
                  title="4. Échanger avec l'annonceur"
                  description="Utilisez la messagerie pour obtenir plus d'informations."
                  color="#7C3AED"
                />
              </>
            ) : (
              <>
                <GuideItem
                  icon="person-outline"
                  title="1. Créer votre compte"
                  description="Connectez-vous avec votre compte propriétaire."
                  color="#2563EB"
                />
                <GuideItem
                  icon="add-circle-outline"
                  title="2. Publier un logement"
                  description="Ajoutez les informations, les photos et la localisation du bien."
                  color="#0D9488"
                />
                <GuideItem
                  icon="calendar-outline"
                  title="3. Gérer les visites"
                  description="Consultez les demandes et gérez les réponses aux visiteurs."
                  color="#D97706"
                />
                <GuideItem
                  icon="chatbubble-outline"
                  title="4. Gérer les échanges"
                  description="Discutez avec les personnes intéressées par vos annonces."
                  color="#7C3AED"
                />
              </>
            )}
          </View>
        </View>

        {/* CONTACT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacter notre assistance</Text>

          <Text style={styles.sectionSubtitle}>
            Décrivez votre problème pour préparer une demande destinée à notre
            équipe.
          </Text>

          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <View style={styles.contactIcon}>
                <Ionicons name="mail-outline" size={24} color="#2563EB" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>Envoyer une demande</Text>
                <Text style={styles.contactDescription}>
                  Expliquez-nous comment nous pouvons vous aider.
                </Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Sujet</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : Problème de connexion"
              placeholderTextColor="#94A3B8"
              value={subject}
              onChangeText={setSubject}
              maxLength={100}
            />

            <Text style={styles.inputLabel}>Votre message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Décrivez votre problème..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
              maxLength={1000}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                submitting && styles.sendButtonDisabled,
              ]}
              onPress={handleContact}
              activeOpacity={0.85}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.sendButtonText}>Envoi en cours...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="paper-plane-outline"
                    size={19}
                    color="#FFFFFF"
                  />
                  <Text style={styles.sendButtonText}>Envoyer ma demande</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Votre demande sera directement transmise à notre équipe Easy Rent.
              Vous recevrez un e-mail de confirmation après son enregistrement.
            </Text>
          </View>
        </View>

        {/* MES DEMANDES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Mes demandes</Text>
              <Text style={styles.sectionSubtitle}>
                Suivez l'évolution de vos demandes d'assistance.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchTickets}
              disabled={loadingTickets}
            >
              <Ionicons name="refresh-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {loadingTickets ? (
            <View style={styles.ticketLoading}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.ticketEmptyText}>
                Chargement de vos demandes...
              </Text>
            </View>
          ) : tickets.length === 0 ? (
            <View style={styles.ticketEmpty}>
              <View style={styles.ticketEmptyIcon}>
                <Ionicons name="file-tray-outline" size={30} color="#94A3B8" />
              </View>

              <Text style={styles.ticketEmptyTitle}>
                Aucune demande pour le moment
              </Text>

              <Text style={styles.ticketEmptyText}>
                Vos demandes envoyées apparaîtront ici.
              </Text>
            </View>
          ) : (
            <View style={styles.ticketList}>
              {tickets.map((ticket) => {
                const status = getStatusInfo(ticket.status);

                return (
                  <View key={ticket.id} style={styles.ticketCard}>
                    <View style={styles.ticketTop}>
                      <View style={styles.ticketIcon}>
                        <Ionicons
                          name="mail-open-outline"
                          size={20}
                          color="#2563EB"
                        />
                      </View>

                      <View style={styles.ticketStatus}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: status.color },
                          ]}
                        />

                        <Text
                          style={[
                            styles.ticketStatusText,
                            { color: status.color },
                          ]}
                        >
                          {status.label}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.ticketSubject}>{ticket.subject}</Text>

                    <Text style={styles.ticketMessage} numberOfLines={3}>
                      {ticket.message}
                    </Text>

                    <View style={styles.ticketFooter}>
                      <View style={styles.ticketDate}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#94A3B8"
                        />
                        <Text style={styles.ticketDateText}>
                          {formatTicketDate(ticket.createdAt)}
                        </Text>
                      </View>

                      <Text style={styles.ticketReference}>
                        #{ticket.id.slice(0, 8)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* REPORT */}
        <TouchableOpacity
          style={styles.reportCard}
          activeOpacity={0.8}
          onPress={() => {
            setSubject("Signalement d'un problème");
            setMessage("");
            Alert.alert(
              "Signaler un problème",
              "Décrivez le problème dans le formulaire de contact ci-dessus.",
            );
          }}
        >
          <View style={styles.reportIcon}>
            <Ionicons name="alert-circle-outline" size={23} color="#DC2626" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.reportTitle}>Signaler un problème</Text>
            <Text style={styles.reportDescription}>
              Une anomalie sur l'application ou une annonce ?
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Ionicons name="home-outline" size={17} color="#94A3B8" />
          <Text style={styles.footerText}>
            Easy Rent · Nous sommes à votre écoute
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingTop: 30,
  },

  content: {
    paddingBottom: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 23,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
    elevation: 2,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1E293B",
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  hero: {
    marginHorizontal: 20,
    padding: 23,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },

  heroIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.17)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  heroTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  heroDescription: {
    fontSize: 12,
    color: "#DBEAFE",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 20,
  },

  searchContainer: {
    width: "100%",
    height: 49,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#1E293B",
  },

  section: {
    marginTop: 29,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
  },

  sectionSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 5,
    marginBottom: 14,
    lineHeight: 17,
  },

  faqBadge: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  faqBadgeText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "800",
  },

  categories: {
    gap: 8,
    paddingBottom: 15,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  categoryButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  faqList: {
    gap: 10,
  },

  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },

  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  faqQuestionText: {
    flex: 1,
  },

  faqTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: 19,
  },

  faqAnswerContainer: {
    flexDirection: "row",
    marginTop: 14,
    gap: 11,
  },

  faqAnswerLine: {
    width: 3,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },

  faqAnswer: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 20,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 10,
  },

  emptyDescription: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 5,
  },

  guideTabs: {
    flexDirection: "row",
    backgroundColor: "#EAEFF6",
    padding: 5,
    borderRadius: 14,
    marginBottom: 13,
  },

  guideTab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingVertical: 12,
    borderRadius: 10,
  },

  guideTabActive: {
    backgroundColor: "#2563EB",
  },

  guideTabText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },

  guideTabTextActive: {
    color: "#FFFFFF",
  },

  guideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  guideItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 13,
  },

  guideIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  guideText: {
    flex: 1,
  },

  guideTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },

  guideDescription: {
    fontSize: 10,
    color: "#94A3B8",
    lineHeight: 16,
    marginTop: 4,
  },

  contactCard: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 20,
    elevation: 2,
  },

  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 21,
  },

  contactIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  contactTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },

  contactDescription: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    lineHeight: 15,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    minHeight: 47,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 13,
    fontSize: 12,
    color: "#1E293B",
    marginBottom: 16,
  },

  messageInput: {
    height: 115,
    paddingTop: 13,
  },

  sendButton: {
    height: 49,
    backgroundColor: "#2563EB",
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  sendButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  disclaimer: {
    fontSize: 10,
    lineHeight: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
  },

  reportCard: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  reportIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  reportTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },

  reportDescription: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },

  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginTop: 30,
  },

  footerText: {
    fontSize: 10,
    color: "#94A3B8",
  },

  sendButtonDisabled: {
    opacity: 0.65,
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  ticketLoading: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 25,
    alignItems: "center",
    gap: 10,
  },

  ticketEmpty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
  },

  ticketEmptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  ticketEmptyTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },

  ticketEmptyText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 5,
  },

  ticketList: {
    gap: 12,
  },

  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9EEF5",
  },

  ticketTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  ticketIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  ticketStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
  },

  ticketStatusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  ticketSubject: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },

  ticketMessage: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 18,
    marginTop: 7,
  },

  ticketFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 14,
    paddingTop: 12,
  },

  ticketDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  ticketDateText: {
    fontSize: 10,
    color: "#94A3B8",
  },

  ticketReference: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
});
