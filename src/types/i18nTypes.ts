export type TranslationResourcesType = {
    common: {
        yes;
        no;
        title;
        changeLang;
        sendMessage;
        openMenu;
        search;
        emailAddress;
        password;
        welcome;
        resend;
        add;
        update;
        delete;
        dismiss;
        youAdd;
        youUpdate;
        youDismiss;
        adding;
        updating;
        deleting;
        back;
        filter;
        filters;
        details;
        close;
        mainInfo;
        description;
        name;
        specifiers: {
            singularApos;
            singularFem;
            singularMasc;
            plural;
        };
        table: {
            columns: {
                showAll;
                hideAll;
                placeholder;
                search;
                singular;
                plural;
                density;
                comfortable;
                regular;
                skinny;
                selectedLines;
            };
            nav: {
                resultPerPage;
            };
            filter: {
                sortAsc;
                sortDesc;
                hideColumns;
                manageColumns;
                label;
            };
        };
    };
    login: {
        rememberMe;
        forgotPassword;
        pleaseConnect;
        connect;
        reset;
        wrongCredentials;
        expiredSession;
        expiredMfa;
        requiredEmail;
        requiredPassword;
        resetTitle;
        resetMessage;
        resetDetails;
        resetLabel;
        MfaTitle;
        MfaSubtitle;
        MfaDetails;
        MfaRegister;
        resendMfa;
    };
    profile: {
        title;
    };
    nav: {
        profile;
        myScore;
        scoreAdd;
        scoreImport;
        users;
        adverts;
        setup;
        activity;
        schedules;
        proxy;
        logout;
    };
    error: {
        common: {
            error;
        };
        errorMessage;
        errorBoundary: {
            sorry;
            firstErrorMessage;
            supportEmail;
            technicalStaff;
            thanks;
            toSendMessage;
            pleaseSend;
            thenClick;
            errorReport;
            diag;
            source;
            at;
            trace;
            page;
            clockDate;
            browser;
            address;
            linkForward;
        };
        noAccess: {
            title;
            intro;
            please;
            expired;
            login;
        };
        notFound: {
            title;
            intro;
            please;
            advise;
            goBack;
        };
    };
    center: {
        search: {
            newSearch;
            updateSearch;
            filters;
            nothing;
            orderBy;
        };
        bulk: {
            bulkUpdate;
            bulkAdd;
            bulkDelete;
            importXlsx;
            downloadTemplate;
            bulkAddMessage;
            bulkTitle;
            exportXls;
            exportCSV;
        };
        update: {
            success;
        };
        create: {
            success;
        };
        delete: {
            success;
        };
    };
    user: {
        singular;
        plural;
        username;
        firstName;
        lastName;
        fullName;
        email;
        levelAccess;
        lastCon;
        logHistory;
        mobile;
        admin;
        password;
        userId;
    };
    logs: {
        singular;
        plural;
        proxy;
        action;
        entryDate;
        info;
    };
    schedule: {
        singular;
        plural;
        freq;
        isActive;
        lastExec;
        startedAt;
        endedAt;
        nextExec;
        method;
        monitoring;
        monitoringLoading;
        history;
        error;
        timeout;
        ongoing;
        standby;
        ended;
    };
    adverts: {
        singular;
        plural;
        expires;
        createdBy;
    };
};

export type LangType = 'fr' | 'en';
