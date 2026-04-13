package services

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/yourusername/eventhub/models"
	"gorm.io/gorm"
)

type EventService struct {
	DB *gorm.DB
}

func NewEventService(db *gorm.DB) *EventService {
	return &EventService{DB: db}
}

func attachCreatorInfo(event *models.Event) {
	if event == nil || event.Creator.ID == 0 {
		return
	}
	event.CreatedByName = event.Creator.Username
	event.CreatedByEmail = event.Creator.Email
}

func attachCreatorInfoList(events []models.Event) {
	for i := range events {
		attachCreatorInfo(&events[i])
	}
}

func (s *EventService) SaveUploadedImage(file multipart.File, header *multipart.FileHeader) (string, error) {
	if file == nil || header == nil {
		return "", nil
	}

	if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
		return "", err
	}

	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), header.Filename)
	dstPath := filepath.Join("uploads", filename)

	dst, err := os.Create(dstPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return "", err
	}

	return filepath.ToSlash(dstPath), nil
}

func (s *EventService) CreateEvent(event *models.Event) error {
	return s.DB.Create(event).Error
}

func (s *EventService) GetAllEvents() ([]models.Event, error) {
	var events []models.Event
	if err := s.DB.Preload("Creator").Order("date asc").Find(&events).Error; err != nil {
		return nil, err
	}
	attachCreatorInfoList(events)
	return events, nil
}

func (s *EventService) GetEventByID(id string) (*models.Event, error) {
	var event models.Event
	if err := s.DB.Preload("Creator").First(&event, id).Error; err != nil {
		return nil, err
	}
	attachCreatorInfo(&event)
	return &event, nil
}

func (s *EventService) DeleteEvent(event *models.Event) error {
	return s.DB.Delete(event).Error
}

func (s *EventService) UpdateEvent(event *models.Event) error {
	return s.DB.Save(event).Error
}

func (s *EventService) RegisterForEvent(registration *models.EventRegistration) error {
	return s.DB.Create(registration).Error
}

func (s *EventService) GetEventRegistrations(eventID string) ([]models.EventRegistration, error) {
	var registrations []models.EventRegistration
	if err := s.DB.Where("event_id = ?", eventID).Find(&registrations).Error; err != nil {
		return nil, err
	}
	return registrations, nil
}

func (s *EventService) GetUserRegistrations(userID uint) ([]models.EventRegistration, error) {
	var registrations []models.EventRegistration
	if err := s.DB.Preload("Event").Preload("User").Where("user_id = ?", userID).
		Order("created_at desc").Find(&registrations).Error; err != nil {
		return nil, err
	}
	return registrations, nil
}

type EventWithStats struct {
	models.Event
	RegistrationCount int64 `json:"registrationCount"`
}

func (s *EventService) GetAllEventsWithStats() ([]EventWithStats, error) {
	var events []models.Event
	if err := s.DB.Preload("Creator").Order("date asc").Find(&events).Error; err != nil {
		return nil, err
	}
	attachCreatorInfoList(events)

	result := make([]EventWithStats, 0, len(events))
	for _, ev := range events {
		var count int64
		if err := s.DB.Model(&models.EventRegistration{}).Where("event_id = ?", ev.ID).Count(&count).Error; err != nil {
			return nil, err
		}
		result = append(result, EventWithStats{Event: ev, RegistrationCount: count})
	}

	return result, nil
}

func (s *EventService) GetAllRegistrations() ([]models.EventRegistration, error) {
	var registrations []models.EventRegistration
	if err := s.DB.Preload("Event").Preload("User").Order("created_at desc").Find(&registrations).Error; err != nil {
		return nil, err
	}
	return registrations, nil
}
