
class EventManager {
    constructor() {
        this.urlBase = "/agenda"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    sessionError() {
        alert('Ud no ha iniciado sesión')
        window.location.href = 'http://localhost:2000/index.html'
    }

    obtenerDataInicial() {
        let _this = this
        let url = this.urlBase + "/all"
        $.ajax({
            url: url,
            method: 'GET',
            data: {},
            success: function(response){
                if (response == 'logout') 
                    _this.sessionError()
                else {
                    console.log(response)
                    _this.inicializarCalendario(response)
                }
            }
        })
    }

    eliminarEvento(evento) {
        let eventId = evento._id
        $.post(this.urlBase+'/delete/'+eventId, {id: eventId}, (response) => {
            if (response == 'logout') this.sessionError()
            else {
                $('.calendario').fullCalendar('removeEvents', eventId);
                alert(response)
            }
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
                start = $('#start_date').val(),
                title = $('#titulo').val(),
                end = '',
                start_hour = '',
                end_hour = ''

            if (!$('#allDay').is(':checked')) {
                if ($('#start_hour').val() == '' || $('#end_hour').val() == '' || $('#end_date').val() == ''){
                    alert('Complete los campos obligatorios para el evento')
                    return
                }
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"
            let evento = {
                title: title,
                start: start,
                end: end
            }
            if (title != "" && start != "") {                
                $.ajax({
                    url: url,  // '/agenda/new'
                    method: 'POST',
                    data: evento,
                    success: function(response){
                        if (response != 'logout'){
                            let newEvent = {
                                _id: response,
                                title: title,
                                start: start,
                                end: end
                            }
                            $('.calendario').fullCalendar('renderEvent', newEvent)
                            alert('Evento Guardado')
                        }
                        else this.sessionError()
                    }
                })                
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            changeYear: true
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        let fecha = new Date()
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            locale: 'es',
            defaultDate: '2018-05-24',//fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate(),
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "../img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                  this.eliminarEvento(event)
                  //$('.calendario').fullCalendar('removeEvents', event.id);
                }
                $('.delete').find('img').attr('src', '../img/trash.png')
            }
          })
        }

        actualizarEvento(evento){
            if (evento.end === null){
                var start = moment(evento.start).format('YYYY-MM.DD'),
                    url   = this.urlBase + '/update/' + evento._id// + '$' + start + '&' + start 
            } else {
                var start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
                    end   = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'),
                    url   = this.urlBase + '/update/' + evento._id// + '$' + start + '&' + end
            }            
            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    id:    evento._id,
                    start: start,
                    end:   end
                },
                success: function(response){
                    if (response == 'logout') this.sessionError()
                    else alert(response)
                }
            })
        }   

        cerrrarSesion(){
            let url  = this.urlBase +'/logout',
                data = ''
            $.post(url, data, (response) => {
                if (response == 'logout') window.location.href = 'http://localhost:2000/index.html'
                else alert('Error inesperado al cerrar sesión')    
            })
        }

    }
    $('.loader-container').fadeOut('slow')
    const Manager = new EventManager()

    $('.logout-container').on('click', function(){
        Manager.cerrrarSesion()
    })