import React, { useMemo, useState, useCallback, useEffect } from "react";

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

// ============================================
// QUESTIONS FRÉQUENTES ANNONCEUR
// ============================================

const FAQ_DATA = [
  {
    category: "Compte",
    question: "Comment accéder à mon espace annonceur ?",
    answer:
      "Connectez-vous à Easy Rent avec votre compte propriétaire. Vous pourrez ensuite accéder à votre espace annonceur depuis votre profil.",
  },
  {
    category: "Compte",
    question: "Comment modifier mes informations personnelles ?",
    answer:
      "Rendez-vous dans votre profil, puis dans les paramètres de votre compte pour gérer les informations disponibles.",
  },
  {
    category: "Publication",
    question: "Comment publier un logement ?",
    answer:
      "Depuis votre espace annonceur, ouvrez la rubrique de publication. Renseignez les informations du logement, son prix, sa localisation et ajoutez des photos. Vérifiez les informations avant de soumettre votre annonce.",
  },
  {
    category: "Publication",
    question: "Comment modifier une annonce publiée ?",
    answer:
      "Accédez à vos annonces, sélectionnez le logement concerné et ouvrez les options de modification. Vous pourrez mettre à jour les informations disponibles.",
  },
  {
    category: "Publication",
    question: "Comment ajouter des photos à mon logement ?",
    answer:
      "Lors de la création ou de la modification d'une annonce, utilisez l'option d'ajout de photos. Privilégiez des images nettes qui présentent les différentes pièces du logement.",
  },
  {
    category: "Publication",
    question: "Pourquoi mon annonce n'apparaît-elle pas ?",
    answer:
      "Vérifiez que votre annonce a bien été enregistrée et que les informations demandées sont complètes. Si le problème persiste, contactez notre assistance en précisant le logement concerné.",
  },
  {
    category: "Visites",
    question: "Comment consulter les demandes de visite ?",
    answer:
      "Accédez à la rubrique de gestion des visites dans votre espace annonceur pour consulter les demandes envoyées par les personnes intéressées par vos logements.",
  },
  {
    category: "Visites",
    question: "Comment accepter ou refuser une visite ?",
    answer:
      "Ouvrez la demande concernée depuis votre espace de gestion des visites. Consultez les informations puis choisissez l'action proposée pour répondre au demandeur.",
  },
  {
    category: "Messages",
    question: "Comment répondre à un locataire intéressé ?",
    answer:
      "Utilisez la messagerie Easy Rent pour consulter vos conversations et échanger directement avec les personnes intéressées par vos annonces.",
  },
  {
    category: "Messages",
    question: "Pourquoi je ne reçois pas de notification ?",
    answer:
      "Vérifiez les préférences de notification dans les paramètres de votre compte ainsi que les autorisations de notification de votre téléphone.",
  },
  {
    category: "Sécurité",
    question: "Comment protéger mon compte annonceur ?",
    answer:
      "Utilisez un mot de passe personnel et évitez de partager vos identifiants. Si vous remarquez une activité inhabituelle, contactez rapidement notre équipe.",
  },
];

const CATEGORIES = [
  "Tout",
  "Compte",
  "Publication",
  "Visites",
  "Messages",
  "Sécurité",
];

// ============================================
// GUIDES ANNONCEUR
// ============================================

const GUIDES = [
  {
    icon: "person-circle-outline",
    color: "#2563EB",
    title: "1. Accéder à votre espace annonceur",
    description:
      "Connectez-vous à votre compte propriétaire pour retrouver votre tableau de bord et vos fonctionnalités de gestion.",
  },
  {
    icon: "add-circle-outline",
    color: "#0D9488",
    title: "2. Publier un logement",
    description:
      "Ajoutez les caractéristiques du bien, le prix, la localisation et des photos de qualité pour présenter votre logement.",
  },
  {
    icon: "create-outline",
    color: "#7C3AED",
    title: "3. Gérer vos annonces",
    description:
      "Retrouvez vos logements publiés et utilisez les options disponibles pour consulter ou modifier leurs informations.",
  },
  {
    icon: "calendar-outline",
    color: "#D97706",
    title: "4. Gérer les visites",
    description:
      "Consultez les demandes de visite reçues et répondez aux personnes intéressées par vos logements.",
  },
  {
    icon: "chatbubbles-outline",
    color: "#0891B2",
    title: "5. Répondre aux messages",
    description:
      "Échangez avec les candidats locataires depuis votre messagerie et répondez à leurs questions.",
  },
  {
    icon: "notifications-outline",
    color: "#DB2777",
    title: "6. Suivre les notifications",
    description:
      "Consultez les notifications pour rester informé des nouvelles demandes, visites et conversations.",
  },
];

// ============================================
// ÉCRAN AIDE ANNONCEUR
// ============================================

export default function AdvertiserHelpScreen() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ============================================
  // FILTRAGE FAQ
  // ============================================

  const filteredFaq = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "Tout" || item.category === activeCategory;

      const matchesSearch =
        !searchText ||
        item.question.toLowerCase().includes(searchText) ||
        item.answer.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  // ============================================
  // STATUT DES TICKETS
  // ============================================

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
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ============================================
  // RÉCUPÉRATION DES DEMANDES
  // ============================================

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

  // ============================================
  // ENVOI D'UNE DEMANDE
  // ============================================

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

  // ============================================
  // AFFICHAGE FAQ
  // ============================================

  const toggleFaq = (question) => {
    setExpandedFaq((previous) => (previous === question ? null : question));
  };

  // ============================================
  // COMPOSANT GUIDE
  // ============================================

  const GuideItem = ({ item }) => (
    <View style={styles.guideItem}>
      <View style={[styles.guideIcon, { backgroundColor: item.color + "15" }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>

      <View style={styles.guideText}>
        <Text style={styles.guideTitle}>{item.title}</Text>

        <Text style={styles.guideDescription}>{item.description}</Text>
      </View>
    </View>
  );

  // ============================================
  // RENDER
  // ============================================

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
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Aide et assistance</Text>

            <Text style={styles.headerSubtitle}>
              Espace annonceur Easy Rent
            </Text>
          </View>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Ionicons name="headset-outline" size={32} color="#FFFFFF" />
            </View>

            <View style={styles.heroTag}>
              <View style={styles.heroTagDot} />
              <Text style={styles.heroTagText}>Assistance annonceur</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Comment pouvons-nous vous aider ?
          </Text>

          <Text style={styles.heroDescription}>
            Retrouvez des conseils pour gérer vos annonces, vos visites et vos
            échanges avec les locataires.
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une question..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* RACCOURCIS */}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            activeOpacity={0.8}
            onPress={() => {
              setSubject("Problème concernant une annonce");
              setMessage("");
              Alert.alert(
                "Besoin d'aide ?",
                "Décrivez votre problème dans le formulaire de contact.",
              );
            }}
          >
            <View style={styles.quickIconBlue}>
              <Ionicons name="home-outline" size={21} color="#2563EB" />
            </View>

            <Text style={styles.quickActionText}>Mes annonces</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            activeOpacity={0.8}
            onPress={() => {
              setSubject("Problème concernant une visite");
              setMessage("");
              Alert.alert(
                "Besoin d'aide ?",
                "Décrivez votre problème dans le formulaire de contact.",
              );
            }}
          >
            <View style={styles.quickIconOrange}>
              <Ionicons name="calendar-outline" size={21} color="#D97706" />
            </View>

            <Text style={styles.quickActionText}>Visites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            activeOpacity={0.8}
            onPress={() => {
              setSubject("Problème de messagerie");
              setMessage("");
              Alert.alert(
                "Besoin d'aide ?",
                "Décrivez votre problème dans le formulaire de contact.",
              );
            }}
          >
            <View style={styles.quickIconPurple}>
              <Ionicons name="chatbubble-outline" size={21} color="#7C3AED" />
            </View>

            <Text style={styles.quickActionText}>Messages</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Questions fréquentes</Text>

              <Text style={styles.sectionSubtitle}>
                Les réponses pour gérer votre activité.
              </Text>
            </View>

            <View style={styles.faqBadge}>
              <Text style={styles.faqBadgeText}>{filteredFaq.length}</Text>
            </View>
          </View>

          {/* CATÉGORIES */}

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

          {/* QUESTIONS */}

          <View style={styles.faqList}>
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item) => {
                const expanded = expandedFaq === item.question;

                return (
                  <TouchableOpacity
                    key={item.question}
                    activeOpacity={0.8}
                    style={styles.faqItem}
                    onPress={() => toggleFaq(item.question)}
                  >
                    <View style={styles.faqQuestion}>
                      <View style={styles.faqQuestionText}>
                        <Text style={styles.faqCategory}>{item.category}</Text>

                        <Text style={styles.faqTitle}>{item.question}</Text>
                      </View>

                      <View style={styles.faqArrow}>
                        <Ionicons
                          name={expanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#64748B"
                        />
                      </View>
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
          <View style={styles.sectionHeading}>
            <View style={styles.sectionHeadingIcon}>
              <Ionicons name="book-outline" size={21} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Guide de l'annonceur</Text>

              <Text style={styles.sectionSubtitle}>
                Les étapes essentielles pour utiliser Easy Rent.
              </Text>
            </View>
          </View>

          <View style={styles.guideCard}>
            {GUIDES.map((item, index) => (
              <React.Fragment key={item.title}>
                <GuideItem item={item} />

                {index !== GUIDES.length - 1 && (
                  <View style={styles.guideDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* CONTACT */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacter notre assistance</Text>

          <Text style={styles.sectionSubtitle}>
            Notre équipe est disponible pour vous accompagner.
          </Text>

          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <View style={styles.contactIcon}>
                <Ionicons name="mail-outline" size={24} color="#2563EB" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>Envoyer une demande</Text>

                <Text style={styles.contactDescription}>
                  Décrivez votre problème à notre équipe.
                </Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Sujet de votre demande</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex : Problème avec mon annonce"
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

            <Text style={styles.characterCount}>
              {message.length}/1000 caractères
            </Text>

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
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.sendButtonText}>Envoyer ma demande</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.disclaimerContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="#64748B"
              />

              <Text style={styles.disclaimer}>
                Votre demande sera transmise à notre équipe Easy Rent. Vous
                recevrez un e-mail de confirmation après son enregistrement.
              </Text>
            </View>
          </View>
        </View>

        {/* MES DEMANDES */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
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

                      <View
                        style={[
                          styles.ticketStatus,
                          { backgroundColor: status.background },
                        ]}
                      >
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
                        #{String(ticket.id).slice(0, 8)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* SIGNALEMENT */}

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
              Une anomalie sur votre compte ou une annonce ?
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Ionicons name="home-outline" size={17} color="#94A3B8" />

          <Text style={styles.footerText}>
            Easy Rent · Assistance annonceur
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

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

  headerTextContainer: {
    flex: 1,
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

  // HERO

  hero: {
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#2563EB",
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.17)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 7,
  },

  heroTagDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#86EFAC",
  },

  heroTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  heroTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroDescription: {
    fontSize: 12,
    color: "#DBEAFE",
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 20,
  },

  searchContainer: {
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

  // QUICK ACTIONS

  quickActions: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,
  },

  quickAction: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 1,
  },

  quickIconBlue: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  quickIconOrange: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  quickIconPurple: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  quickActionText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#334155",
  },

  // SECTIONS

  section: {
    marginTop: 29,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionHeaderText: {
    flex: 1,
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

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  sectionHeadingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // FAQ

  faqBadge: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
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

  faqCategory: {
    fontSize: 9,
    fontWeight: "800",
    color: "#2563EB",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 0.5,
  },

  faqTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: 19,
  },

  faqArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
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

  // GUIDE

  guideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 3,
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

  guideDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 56,
  },

  // CONTACT

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

  characterCount: {
    fontSize: 10,
    color: "#94A3B8",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 14,
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

  sendButtonDisabled: {
    opacity: 0.65,
  },

  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 14,
  },

  disclaimer: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    color: "#94A3B8",
  },

  // TICKETS

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
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

  // REPORT

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

  // FOOTER

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
});
