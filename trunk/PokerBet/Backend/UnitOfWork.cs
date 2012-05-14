﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.Facade.Interfaces;
using Backend.DataContext;
using Backend.Facade.Implementations;

namespace Backend
{
    public class UnitOfWork : IDisposable
    {
        private PokerBetContext context = new PokerBetContext();

        private IPokerBetFacade pokerFacade;
        private IAdminFacade adminFacade;

        public IPokerBetFacade PokerBetSrvc
        {
            get
            {
                if (pokerFacade == null)
                {
                    pokerFacade = new PokerBetFacade(context);
                }
                return pokerFacade;
            }
        }

        public IAdminFacade AdminSrvc
        {
            get
            {
                if (adminFacade == null)
                {
                    adminFacade = new AdminFacade(context);
                }
                return adminFacade;
            }
        }

        #region Resource removable pattern
        private bool isDisposed = false;

        private void Dispose(bool disposing)
        {
            if (!this.isDisposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.isDisposed = true;
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~UnitOfWork()
        {
            this.Dispose(false);
        }
        #endregion
    }
}